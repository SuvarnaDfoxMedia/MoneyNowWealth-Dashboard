// import cron from "node-cron";
// import UserSubscription, { IUserSubscription } from "../models/userSubscriptionModel";
// import SubscriptionPlan from "../models/subscriptionPlan.model";
// import { userSubscriptionPaymentService } from "../services/userSubscriptionPaymentService";

// /* ---------------------------------------------------
//    Helper: Add Duration to Date
// --------------------------------------------------- */
// const addDurationToDate = (
//   date: Date,
//   value: number,
//   unit: "day" | "month" | "year"
// ): Date => {
//   const result = new Date(date);
//   switch (unit) {
//     case "day": result.setDate(result.getDate() + value); break;
//     case "month": result.setMonth(result.getMonth() + value); break;
//     case "year": result.setFullYear(result.getFullYear() + value); break;
//   }
//   return result;
// };

// /* ---------------------------------------------------
//    Subscription Scheduler (runs daily at midnight IST)
// --------------------------------------------------- */
// export function startSubscriptionScheduler() {
//   cron.schedule("0 0 * * *", async () => {
//     console.log("Subscription scheduler running:", new Date().toISOString());
//     try {
//       const now = new Date();
//       now.setHours(0, 0, 0, 0);

//       const freePlan = await SubscriptionPlan.findOne({ name: "Free", is_active: true });
//       const premiumPlan = await SubscriptionPlan.findOne({ name: "Premium", is_active: true });
//       if (!freePlan || !premiumPlan) return console.warn("Free or Premium plan not found");

//       const expiredSubs: IUserSubscription[] = await UserSubscription.find({
//         end_date: { $lte: now },
//         is_active: true,
//         is_deleted: false,
//       });

//       for (const sub of expiredSubs) {

//         // Case 1: Free → Premium
//         if (sub.plan_type === "Free") {
//           sub.plan_id = premiumPlan._id;
//           sub.plan_type = "Premium";
//           sub.trial_type = "premium_sample";
//           sub.start_date = now;
//           sub.end_date = addDurationToDate(now, premiumPlan.duration.value, premiumPlan.duration.unit as any);
//           sub.status = "upgrade";
//           sub.is_active = true;
//           sub.auto_renew = true;
//           await sub.save();

//           await userSubscriptionPaymentService.create({
//             user_id: sub.user_id,
//             subscription_id: sub._id,
//             plan_id: premiumPlan._id,
//             amount: 0,
//             currency: "INR",
//             payment_method: "cron",
//             type: "upgrade",
//             payment_status: "success",
//             payment_date: new Date(),
//             metadata: { note: "Auto-upgraded from Free → Premium" },
//           });

//           console.log(`User ${sub.user_id} upgraded to Premium`);
//         }

//         // Case 2: Premium → Free
//         else if (sub.plan_type === "Premium") {
//           sub.plan_id = freePlan._id;
//           sub.plan_type = "Free";
//           sub.trial_type = "free_sample";
//           sub.start_date = now;
//           sub.end_date = addDurationToDate(now, freePlan.duration.value, freePlan.duration.unit as any);
//           sub.status = "downgrade";
//           sub.is_active = true; // keep active for Free until payment
//           sub.auto_renew = false;
//           await sub.save();

//           await userSubscriptionPaymentService.create({
//             user_id: sub.user_id,
//             subscription_id: sub._id,
//             plan_id: freePlan._id,
//             amount: 0,
//             currency: "INR",
//             payment_method: "cron",
//             type: "downgrade",
//             payment_status: "success",
//             payment_date: new Date(),
//             metadata: { note: "Auto-downgraded from Premium → Free; awaiting payment" },
//           });

//           console.log(`User ${sub.user_id} downgraded to Free`);
//         }
//       }
//     } catch (err) {
//       console.error("Subscription CRON ERROR:", err);
//     }
//   }, { timezone: "Asia/Kolkata" });

//   console.log("Subscription scheduler started (daily at midnight IST)");
// }



// import cron from "node-cron";
// import UserSubscription, { IUserSubscription } from "../models/userSubscriptionModel";
// import SubscriptionPlan from "../models/subscriptionPlan.model";
// import { userSubscriptionPaymentService } from "../services/userSubscriptionPaymentService";

// /* Helper: Add Duration to Date */
// const addDurationToDate = (date: Date, value: number, unit: "day" | "month" | "year"): Date => {
//   const result = new Date(date);
//   switch (unit) {
//     case "day":
//       result.setDate(result.getDate() + value);
//       break;
//     case "month":
//       result.setMonth(result.getMonth() + value);
//       break;
//     case "year":
//       result.setFullYear(result.getFullYear() + value);
//       break;
//   }
//   return result;
// };

// /* Subscription Scheduler */
// export function startSubscriptionScheduler() {
//   cron.schedule("0 0 * * *", async () => {
//     console.log("Subscription scheduler running:", new Date().toISOString());

//     try {
//       const now = new Date();

//       const freePlan = await SubscriptionPlan.findOne({ name: "Free", is_active: true });
//       const premiumPlan = await SubscriptionPlan.findOne({ name: "Premium", is_active: true });

//       if (!freePlan || !premiumPlan) {
//         console.warn("Free or Premium plan not found");
//         return;
//       }

//       // Find subscriptions that **should be upgraded/downgraded today**
//       const subsToProcess: IUserSubscription[] = await UserSubscription.find({
//         is_active: true,
//         is_deleted: false,
//         end_date: { $lte: now }, // includes subscriptions that ended before now
//       });

//       if (!subsToProcess.length) {
//         console.log("No subscriptions need processing today");
//         return;
//       }

//       console.log(`${subsToProcess.length} subscription(s) to process today.`);

//       for (const sub of subsToProcess) {
//         // Upgrade Free → Premium
//         if (sub.plan_type?.toLowerCase() === "free") {
//           sub.plan_id = premiumPlan._id;
//           sub.plan_type = "Premium";
//           sub.trial_type = "premium_sample";
//           sub.start_date = now;
//           sub.end_date = addDurationToDate(now, premiumPlan.duration.value, premiumPlan.duration.unit);
//           sub.status = "upgrade";
//           sub.is_active = true;
//           sub.auto_renew = true;
//           await sub.save();

//           await userSubscriptionPaymentService.create({
//             user_id: sub.user_id,
//             user_subscription_id: sub._id,
//             plan_id: premiumPlan._id,
//             amount: 0,
//             currency: premiumPlan.currency || "INR",
//             payment_method: "cron",
//             type: "upgrade",
//             payment_status: "success",
//             payment_date: now,
//             metadata: { note: "Auto-upgraded from Free → Premium" },
//           });

//           console.log(`User ${sub.user_id} upgraded to Premium`);
//         }

//         // Downgrade Premium → Free
//         else if (sub.plan_type?.toLowerCase() === "premium") {
//           sub.plan_id = freePlan._id;
//           sub.plan_type = "Free";
//           sub.trial_type = "free_sample";
//           sub.start_date = now;
//           sub.end_date = addDurationToDate(now, freePlan.duration.value, freePlan.duration.unit);
//           sub.status = "downgrade";
//           sub.is_active = true;
//           sub.auto_renew = false;
//           await sub.save();

//           await userSubscriptionPaymentService.create({
//             user_id: sub.user_id,
//             user_subscription_id: sub._id,
//             plan_id: freePlan._id,
//             amount: 0,
//             currency: freePlan.currency || "INR",
//             payment_method: "cron",
//             type: "downgrade",
//             payment_status: "success",
//             payment_date: now,
//             metadata: { note: "Auto-downgraded from Premium → Free" },
//           });

//           console.log(`User ${sub.user_id} downgraded to Free`);
//         }
//       }
//     } catch (err) {
//       console.error("Subscription CRON ERROR:", err);
//     }
//   }, { timezone: "Asia/Kolkata" });

//   console.log("Subscription scheduler started (runs daily at midnight IST)");
// }

import cron from "node-cron";
import mongoose from "mongoose";

import UserSubscription, { IUserSubscription } from "../models/userSubscriptionModel";
import SubscriptionPlan from "../models/subscriptionPlan.model";
import { userSubscriptionPaymentService } from "@/services/userSubscriptionPaymentService";
import { userSubscriptionService } from "@/services/userSubscriptionService";

// -----------------------------
// Helper: Add Duration to Date
// -----------------------------
const addDuration = (date: Date, value: number, unit: "day" | "month" | "year") => {
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

// -----------------------------
// Typed Subscription for Payment
// -----------------------------
interface SubscriptionForPayment {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  end_date?: Date;
  last_payment_id?: mongoose.Types.ObjectId;
  status?: string;
  trial_type?: string;
  is_active?: boolean;
  save: () => Promise<any>;
}

// -----------------------------
// Subscription Scheduler
// -----------------------------
export const startSubscriptionScheduler = async () => {
  console.log("Subscription scheduler running:", new Date().toISOString());

  const activeSubs = await UserSubscription.find({ is_deleted: false });

  for (const sub of activeSubs) {
    const now = new Date();

    // Skip if already inactive or not expired
    if (!sub.is_active) continue;
    if (sub.end_date && sub.end_date > now) continue;

    console.log(`Subscription expired for user: ${sub.user_id}`);

    // Mark current subscription as inactive
    sub.is_active = false;
    await sub.save();

    // Determine new plan
    let newPlan;
    let type: "upgrade" | "downgrade";

    if (sub.plan_type === "Free") {
      newPlan = await SubscriptionPlan.findOne({ name: "Premium", is_active: true });
      type = "upgrade";
    } else if (sub.plan_type === "Premium") {
      newPlan = await SubscriptionPlan.findOne({ name: "Free", is_active: true });
      type = "downgrade";
    }

    if (!newPlan) continue; // Skip if no valid plan found

    try {
      // Create new subscription
      const newSub = await userSubscriptionService.createOrUpdateSubscription(
        sub.user_id.toString(),
        newPlan._id.toString(),
        newPlan.duration.value,
        newPlan.duration.unit,
        newPlan.name.toLowerCase() === "free" ? "free_sample" : "premium_sample"
      );

      // Cast to proper type for payment service
      const subForPayment = newSub as unknown as SubscriptionForPayment;

      // Create payment for new subscription
      await userSubscriptionPaymentService.createPaymentForSubscription(
        subForPayment,
        newPlan,
        type
      );

      console.log(`Created ${type} subscription for user: ${sub.user_id}`);
    } catch (err) {
      console.error(`Failed to create ${type} subscription for user: ${sub.user_id}`, err);
    }
  }
};

// -----------------------------
// Cron job example (every day at midnight)
// -----------------------------
cron.schedule("0 0 * * *", async () => {
  try {
    await startSubscriptionScheduler();
  } catch (err) {
    console.error("Error running subscription scheduler:", err);
  }
});
