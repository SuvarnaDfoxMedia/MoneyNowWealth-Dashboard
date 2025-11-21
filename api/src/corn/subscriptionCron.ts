

import cron from "node-cron";
import UserSubscription from "../models/userSubscriptionModel.ts";
import SubscriptionPlan from "../models/subscriptionPlan.model.ts";
import { userSubscriptionPaymentService } from "../services/userSubscriptionPaymentService.ts";

// Helper: Add Duration
const addDurationToDate = (
  date: Date,
  value: number,
  unit: "day" | "month" | "year"
) => {
  const result = new Date(date);
  switch (unit) {
    case "day":
      result.setDate(result.getDate() + value);
      break;
    case "month":
      result.setMonth(result.getMonth() + value);
      break;
    case "year":
      result.setFullYear(result.getFullYear() + value);
      break;
  }
  return result;
};

// ------------------ Subscription Scheduler ------------------
export function startSubscriptionScheduler() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Subscription scheduler running:", new Date().toISOString());

      try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const freePlan = await SubscriptionPlan.findOne({ name: "Free", is_active: true });
        const premiumPlan = await SubscriptionPlan.findOne({ name: "Premium", is_active: true });

        if (!freePlan || !premiumPlan) {
          console.warn("Free or Premium plan not found");
          return;
        }

        const expiredSubs = await UserSubscription.find({
          end_date: { $lte: now },
          is_deleted: false,
          is_active: true,
        });

        console.log(`Found ${expiredSubs.length} expired subscriptions`);

        for (const sub of expiredSubs) {
          // Downgrade Premium → Free
          if (sub.plan_type === "Premium") {
            sub.plan_id = freePlan._id;
            sub.plan_type = "Free";
            sub.trial_type = "free_sample";
            sub.start_date = now;
            sub.end_date = addDurationToDate(now, freePlan.duration.value, freePlan.duration.unit as "day" | "month" | "year");
            sub.status = "downgrade";
            sub.is_active = false;
            sub.auto_renew = false;
            await sub.save();

            // Create payment record via service
            await userSubscriptionPaymentService.create({
              user_id: sub.user_id,
              subscription_id: sub._id,
              plan_id: freePlan._id,
              amount: 0,
              currency: "INR",
              payment_method: "cron",
              type: "downgrade",
              payment_status: "success",
              payment_date: new Date(),
              metadata: { note: "Downgraded to Free; payment required to activate" },
            });

            console.log(`Downgraded user ${sub.user_id} from Premium → Free`);
            continue;
          }

          // Upgrade Free → Premium
          if (sub.plan_type === "Free" && sub.trial_type === "free_sample" && sub.is_active) {
            sub.plan_id = premiumPlan._id;
            sub.plan_type = "Premium";
            sub.trial_type = "premium_sample";
            sub.start_date = now;
            sub.end_date = addDurationToDate(now, premiumPlan.duration.value, premiumPlan.duration.unit as "day" | "month" | "year");
            sub.status = "upgrade";
            sub.is_active = true;
            sub.auto_renew = true;
            await sub.save();

            // Create payment record via service
            await userSubscriptionPaymentService.create({
              user_id: sub.user_id,
              subscription_id: sub._id,
              plan_id: premiumPlan._id,
              amount: 0,
              currency: "INR",
              payment_method: "cron",
              type: "upgrade",
              payment_status: "success",
              payment_date: new Date(),
              metadata: { note: "Auto-upgraded to Premium" },
            });

            console.log(`Upgraded user ${sub.user_id} from Free → Premium`);
          }
        }
      } catch (err) {
        console.error("Subscription CRON ERROR:", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  console.log("Subscription scheduler started (runs daily at midnight IST)");
}

// ------------------ Manual Payment Handler ------------------
export const activateSubscriptionAfterPayment = async (subId: string) => {
  const sub = await UserSubscription.findById(subId);
  if (!sub) return;

  const premiumPlan = await SubscriptionPlan.findOne({ name: "Premium", is_active: true });
  if (!premiumPlan) return;

  sub.plan_id = premiumPlan._id;
  sub.plan_type = "Premium";
  sub.trial_type = "premium_sample";
  sub.start_date = new Date();
  sub.end_date = addDurationToDate(new Date(), premiumPlan.duration.value, premiumPlan.duration.unit as "day" | "month" | "year");
  sub.status = "upgrade";
  sub.is_active = true;
  sub.auto_renew = true;
  await sub.save();

  // Create payment via service
  await userSubscriptionPaymentService.create({
    user_id: sub.user_id,
    subscription_id: sub._id,
    plan_id: premiumPlan._id,
    amount: 0,
    currency: "INR",
    payment_method: "manual",
    type: "upgrade",
    payment_status: "success",
    payment_date: new Date(),
    metadata: { note: "Upgraded after manual payment" },
  });

  console.log(`User ${sub.user_id} upgraded to Premium after payment`);
};
