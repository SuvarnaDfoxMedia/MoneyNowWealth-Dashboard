import mongoose from "mongoose";
import UserSubscriptionPayment from "../models/userSubscriptionPaymentModel.ts";

// Helper: Add Duration to a date
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

interface Plan {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  currency?: string;
  duration: { value: number; unit: "day" | "month" | "year" };
}

interface Subscription {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  end_date?: Date;
  last_payment_id?: mongoose.Types.ObjectId;
  status?: string;
  trial_type?: string;
  is_active?: boolean;
  save: () => Promise<any>;
}

export const userSubscriptionPaymentService = {
  /**
   * CREATE PAYMENT AND EXTEND SUBSCRIPTION
   * @param sub Subscription document
   * @param plan Plan document
   * @param type "new" | "upgrade" | "downgrade"
   * @returns Created payment document
   */
  async createPaymentForSubscription(
    sub: Subscription,
    plan: Plan,
    type: "new" | "upgrade" | "downgrade" = "new"
  ) {
    const isFreePlan = plan.name.toLowerCase() === "free";

    // 1️⃣ Create payment object
    const paymentData = {
      user_id: sub.user_id,
      user_subscription_id: sub._id,
      plan_id: plan._id,
      amount: isFreePlan ? 0 : plan.price,
      currency: plan.currency || "INR",
      payment_method: isFreePlan ? "free_plan" : "manual",
      payment_status: "success",
      payment_date: new Date(),
      type,
      metadata: { note: isFreePlan ? "Free plan" : "Paid plan" },
    };

    const payment = new UserSubscriptionPayment(paymentData);
    await payment.save();

    // 2️⃣ Update subscription with new end_date and last_payment_id
    sub.last_payment_id = payment._id;

    const baseDate = sub.end_date && sub.end_date > new Date() ? sub.end_date : new Date();
    sub.end_date = addDuration(baseDate, plan.duration.value, plan.duration.unit);

    sub.status = type;
    if (isFreePlan) sub.trial_type = "free_sample";
    sub.is_active = true;

    await sub.save();

    return payment;
  },
};
