import express from "express";
import SubscriptionPlan from "../models/subscriptionPlan.model.ts";
import { subscriptionPlanService } from "../services/subscriptionPlanService.ts";

type Request = express.Request;
type Response = express.Response;

/* ---------------------------------------------------
   GET: All Subscription Plans (with filters & pagination)
--------------------------------------------------- */
export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const { search, page, limit } = req.query;
    const filter: Record<string, any> = {
      is_deleted: { $ne: true }, // exclude deleted
    };

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: "i" } },
        { description: { $regex: String(search), $options: "i" } },
      ];
    }

    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const perPage = Number(limit) > 0 ? Number(limit) : 10;

    const { plans, total } = await subscriptionPlanService.getAll(filter, pageNum, perPage);

    res.json({
      success: true,
      plans,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error: any) {
    console.error("Get subscription plans error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------------------------------------------
   GET: By ID
--------------------------------------------------- */
export const getSubscriptionPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await subscriptionPlanService.getById(id);
    if (!plan)
      return res.status(404).json({ success: false, message: "Subscription plan not found" });

    res.json({ success: true, plan });
  } catch (error: any) {
    console.error("Get subscription plan by ID error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------------------------------------------
   POST: Create Subscription Plan
--------------------------------------------------- */
export const addSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { name, description, price, currency, duration, features, is_active } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required and cannot be empty",
      });
    }

    // Validate description, price, and duration
    if (!description || price == null || !duration?.value || !duration?.unit) {
      return res.status(400).json({
        success: false,
        message: "Description, price, and duration (value & unit) are required",
      });
    }

    // Validate duration unit
    const allowedUnits = ["day", "month", "year"];
    if (!allowedUnits.includes(duration.unit)) {
      return res.status(400).json({
        success: false,
        message: `Invalid duration unit. Allowed units: ${allowedUnits.join(", ")}`,
        field: "duration.unit",
      });
    }

    // Check for duplicate name (case-insensitive)
    const existingPlan = await SubscriptionPlan.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      is_deleted: { $ne: true },
    });

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "A subscription plan with this name already exists",
        field: "name",
      });
    }

    const planData = {
      name: name.trim(),
      description,
      price,
      currency: currency || "INR",
      duration,
      features: Array.isArray(features) ? features : [],
      is_active: is_active !== undefined ? is_active : true,
    };

    const plan = await subscriptionPlanService.create(planData);

    res.status(201).json({ success: true, plan });
  } catch (error: any) {
    console.error("Add subscription plan error:", error);

    if (error?.code === 11000) {
      const dupKey = error.keyValue ? Object.keys(error.keyValue)[0] : "field";
      return res
        .status(400)
        .json({ success: false, message: `${dupKey} already exists`, field: dupKey });
    }

    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------------------------------------------
   PUT: Update Subscription Plan
--------------------------------------------------- */
export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name && !updateData.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    // Validate duration unit if provided
    if (updateData.duration?.unit) {
      const allowedUnits = ["day", "month", "year"];
      if (!allowedUnits.includes(updateData.duration.unit)) {
        return res.status(400).json({
          success: false,
          message: `Invalid duration unit. Allowed units: ${allowedUnits.join(", ")}`,
          field: "duration.unit",
        });
      }
    }

    // Check for duplicate name
    if (updateData.name) {
      const existingPlan = await SubscriptionPlan.findOne({
        _id: { $ne: id },
        name: { $regex: `^${updateData.name}$`, $options: "i" },
        is_deleted: { $ne: true },
      });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "A subscription plan with this name already exists",
          field: "name",
        });
      }
    }

    const plan = await subscriptionPlanService.update(id, updateData);
    if (!plan)
      return res.status(404).json({ success: false, message: "Subscription plan not found" });

    res.json({ success: true, plan });
  } catch (error: any) {
    console.error("Update subscription plan error:", error);
    if (error?.code === 11000) {
      const dupKey = error.keyValue ? Object.keys(error.keyValue)[0] : "field";
      return res
        .status(400)
        .json({ success: false, message: `${dupKey} already exists`, field: dupKey });
    }
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------------------------------------------
   PATCH: Activate / Deactivate
--------------------------------------------------- */
export const toggleSubscriptionPlanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await subscriptionPlanService.toggleActive(id);

    if (!plan)
      return res.status(404).json({ success: false, message: "Subscription plan not found" });

    res.json({
      success: true,
      message: plan.is_active
        ? "Subscription plan activated successfully"
        : "Subscription plan deactivated successfully",
      plan,
    });
  } catch (error: any) {
    console.error("Toggle subscription plan status error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------------------------------------------
   DELETE: Soft Delete
--------------------------------------------------- */
export const deleteSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await subscriptionPlanService.softDelete(id);

    if (!plan)
      return res.status(404).json({ success: false, message: "Subscription plan not found" });

    res.json({
      success: true,
      message: "Subscription plan deleted successfully (soft delete)",
      plan,
    });
  } catch (error: any) {
    console.error("Delete subscription plan error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------------------------------------------
   PATCH: Restore Soft Deleted Plan
--------------------------------------------------- */
export const restoreSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await subscriptionPlanService.restore(id);

    if (!plan)
      return res.status(404).json({ success: false, message: "Subscription plan not found" });

    res.json({
      success: true,
      message: "Subscription plan restored successfully",
      plan,
    });
  } catch (error: any) {
    console.error("Restore subscription plan error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
