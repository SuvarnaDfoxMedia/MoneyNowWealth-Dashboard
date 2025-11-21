

import mongoose from "mongoose";
import UserSubscription from "../models/userSubscriptionModel.ts";
import User from "../models/userModel.ts";
import SubscriptionPlanModel from "../models/subscriptionPlan.model.ts";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

// ========================= HELPER =========================
// ONLY day, month, year allowed now
const addDurationToDate = (
  date: Date,
  value: number,
  unit: "day" | "month" | "year"
) => {
  const newDate = new Date(date);
  switch (unit) {
    case "day":
      newDate.setDate(newDate.getDate() + value);
      break;
    case "month":
      newDate.setMonth(newDate.getMonth() + value);
      break;
    case "year":
      newDate.setFullYear(newDate.getFullYear() + value);
      break;
  }
  return newDate;
};

export const userSubscriptionService = {
  // ========================= GET ALL SUBSCRIPTIONS =========================
  async getAll(filter: any = {}, options: PaginationOptions = {}) {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.max(options.limit || 10, 1);
    const skip = (page - 1) * limit;

    const searchQuery: any = filter.search
      ? {
          $or: [
            { firstname: { $regex: filter.search, $options: "i" } },
            { lastname: { $regex: filter.search, $options: "i" } },
            { email: { $regex: filter.search, $options: "i" } },
          ],
        }
      : {};

    const total = await User.countDocuments(searchQuery);

    const users = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .select("-password -resetPasswordToken -resetPasswordExpires");

    const subscriptions = await Promise.all(
      users.map(async (user) => {
        let subscription = await UserSubscription.findOne({
          user_id: user._id,
          ...(filter.plan_id ? { plan_id: filter.plan_id } : {}),
          ...(filter.status ? { status: filter.status } : {}),
          ...(filter.is_active !== undefined ? { is_active: filter.is_active } : {}),
          ...(filter.is_deleted !== undefined ? { is_deleted: filter.is_deleted } : {}),
        });

        if (subscription) subscription = await subscription.populateFull();

        return { ...subscription?.toObject(), user };
      })
    );

    return {
      subscriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // ========================= GET SUBSCRIPTION BY ID =========================
  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const subscription = await UserSubscription.findById(id);
    return subscription ? subscription.populateFull() : null;
  },

  // ========================= CREATE OR UPDATE SUBSCRIPTION =========================
  async createOrUpdateSubscription(
    userId: string,
    planId: string,
    durationValue: number,
    durationUnit: "day" | "month" | "year",
    trialType?: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(planId))
      return null;

    const now = new Date();
    const endDate = addDurationToDate(now, durationValue, durationUnit);

    let subscription = await UserSubscription.findOne({
      user_id: userId,
      plan_id: planId,
      is_active: true,
      is_deleted: false,
    });

    if (subscription) {
      subscription.end_date = endDate;
      if (trialType) subscription.trial_type = trialType;
      await subscription.save();
    } else {
      subscription = await UserSubscription.create({
        user_id: userId,
        plan_id: planId,
        start_date: now,
        end_date: endDate,
        status: "new",
        trial_type: trialType || "",
        is_active: true,
        auto_renew: false,
      });
    }

    return subscription.populateFull();
  },

  // ========================= ASSIGN TRIAL =========================
  async assignTrial(userId: string, trialType: "free" | "premium") {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;

    const planName = trialType === "free" ? "Free" : "Premium";

    const plan = await SubscriptionPlanModel.findOne({
      name: planName,
      is_active: true,
    });

    if (!plan) throw new Error(`${planName} not found`);

    const start = new Date();
    const durationUnit = (plan.duration?.unit || "day") as "day" | "month" | "year";
    const end = addDurationToDate(start, plan.duration.value, durationUnit);

    const trial = await UserSubscription.create({
      user_id: userId,
      plan_id: plan._id,
      start_date: start,
      end_date: end,
      status: "new",
      trial_type: trialType === "free" ? "free_sample" : "premium_sample",
      is_active: true,
      auto_renew: false,
    });

    return trial.populateFull();
  },

  // ========================= GET ACTIVE SUBSCRIPTION =========================
  async getByUserId(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;

    let subscription = await UserSubscription.findOne({
      user_id: userId,
      status: "upgrade",
      is_deleted: false,
    }).sort({ end_date: -1 });

    if (!subscription) {
      subscription = await UserSubscription.findOne({
        user_id: userId,
        status: { $in: ["new", "downgrade"] },
        is_deleted: false,
      }).sort({ end_date: -1 });
    }

    return subscription ? subscription.populateFull() : null;
  },

  // ========================= EXTEND SUBSCRIPTION PERIOD =========================
  async extendSubscriptionPeriod(
    id: string,
    durationValue: number,
    durationUnit: "day" | "month" | "year"
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const subscription = await UserSubscription.findById(id);
    if (!subscription) return null;

    const baseDate =
      subscription.end_date && subscription.end_date > new Date()
        ? subscription.end_date
        : new Date();

    subscription.end_date = addDurationToDate(baseDate, durationValue, durationUnit);
    await subscription.save();
    return subscription;
  },

  // ========================= SOFT DELETE =========================
  async softDelete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const subscription = await UserSubscription.findById(id);
    if (!subscription) return null;

    subscription.is_deleted = true;
    subscription.is_active = false;
    subscription.deleted_at = new Date();
    await subscription.save();
    return subscription;
  },

  // ========================= RESTORE =========================
  async restore(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const subscription = await UserSubscription.findById(id);
    if (!subscription) return null;

    subscription.is_deleted = false;
    subscription.is_active = true;
    subscription.deleted_at = null;
    await subscription.save();
    return subscription;
  },

  // ========================= GET EXPIRED SUBSCRIPTIONS =========================
  async getExpiredFreeSubscriptions(now: Date) {
    return UserSubscription.find({
      trial_type: "free_sample",
      end_date: { $lt: now },
      is_deleted: false,
    });
  },

  async getExpiredPremiumSubscriptions(now: Date) {
    return UserSubscription.find({
      trial_type: "premium_sample",
      end_date: { $lt: now },
      is_deleted: false,
    });
  },
};
