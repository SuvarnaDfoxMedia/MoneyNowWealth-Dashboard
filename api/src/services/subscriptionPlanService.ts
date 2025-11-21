import mongoose from "mongoose";
import SubscriptionPlan from "../models/subscriptionPlan.model.ts";

const allowedUnits = ["minute", "day", "month", "year"]; // singular units

export const subscriptionPlanService = {
  /* ---------------------------------------------------
     GET: All Subscription Plans (with pagination)
  --------------------------------------------------- */
  getAll: async (filter: Record<string, any> = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      SubscriptionPlan.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // improves performance (read-only)
      SubscriptionPlan.countDocuments(filter),
    ]);

    return { plans, total };
  },

  /* ---------------------------------------------------
     GET: Subscription Plan by ID
  --------------------------------------------------- */
  getById: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await SubscriptionPlan.findOne({
      _id: id,
      is_deleted: { $ne: true },
    }).lean();
  },

  /* ---------------------------------------------------
     CREATE: New Subscription Plan
  --------------------------------------------------- */
  create: async (data: any) => {
    // Validate duration unit
    if (!allowedUnits.includes(data.duration.unit)) {
      throw new Error(
        `Invalid duration unit. Allowed units: ${allowedUnits.join(", ")}`
      );
    }

    const plan = new SubscriptionPlan({
      ...data,
      is_active: data?.is_active ?? true,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await plan.save();
  },

  /* ---------------------------------------------------
     UPDATE: Subscription Plan
  --------------------------------------------------- */
  update: async (id: string, updateData: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    // Validate duration unit if provided
    if (updateData.duration?.unit && !allowedUnits.includes(updateData.duration.unit)) {
      throw new Error(
        `Invalid duration unit. Allowed units: ${allowedUnits.join(", ")}`
      );
    }

    updateData.updated_at = new Date();

    return await SubscriptionPlan.findOneAndUpdate(
      { _id: id, is_deleted: { $ne: true } },
      updateData,
      { new: true }
    );
  },

  /* ---------------------------------------------------
     PATCH: Toggle Active / Inactive
  --------------------------------------------------- */
  toggleActive: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const plan = await SubscriptionPlan.findOne({
      _id: id,
      is_deleted: { $ne: true },
    });

    if (!plan) return null;

    plan.is_active = !plan.is_active;
    plan.updated_at = new Date();

    return await plan.save();
  },

  /* ---------------------------------------------------
     DELETE: Soft Delete Plan
  --------------------------------------------------- */
  softDelete: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const plan = await SubscriptionPlan.findOne({
      _id: id,
      is_deleted: { $ne: true },
    });

    if (!plan) return null;

    plan.is_deleted = true;
    plan.is_active = false;
    plan.deleted_at = new Date();
    plan.updated_at = new Date();

    return await plan.save();
  },

  /* ---------------------------------------------------
     RESTORE: Restore Soft Deleted Plan
  --------------------------------------------------- */
  restore: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const plan = await SubscriptionPlan.findById(id);
    if (!plan) return null;

    plan.is_deleted = false;
    plan.is_active = true;
    plan.deleted_at = undefined;
    plan.updated_at = new Date();

    return await plan.save();
  },
};
