


import express from "express";
import { userSubscriptionService } from "../services/userSubscriptionService.ts";
import User from "../models/userModel.ts";
import SubscriptionPlan from "../models/subscriptionPlan.model.ts";

type Request = express.Request;
type Response = express.Response;

// ================= GET ALL USER SUBSCRIPTIONS =================
export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || "").trim();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const userSearchQuery: any = {
      role: { $ne: "admin" },
      ...(search
        ? {
            $or: [
              { firstname: { $regex: search, $options: "i" } },
              { lastname: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    const totalUsers = await User.countDocuments(userSearchQuery);
    const users = await User.find(userSearchQuery)
      .skip(skip)
      .limit(limit)
      .select("-password -resetPasswordToken -resetPasswordExpires");

    // Get subscription plans (singular unit names)
    const freePlan = await SubscriptionPlan.findOne({ name: "Free", is_active: true });
    const premiumPlan = await SubscriptionPlan.findOne({ name: "Premium", is_active: true });

    if (!freePlan) {
      return res.status(500).json({
        success: false,
        message: "Free plan not found. Please create a plan with name 'Free' in DB.",
      });
    }

    const subscriptions = await Promise.all(
      users.map(async (user) => {
        let subscription = await userSubscriptionService.getByUserId(user._id.toString());

        // Auto assign Free plan if user has no subscription
        if (!subscription) {
          try {
            subscription = await userSubscriptionService.createOrUpdateSubscription(
              user._id.toString(),
              freePlan._id.toString(),
              freePlan.duration.value,
              freePlan.duration.unit as "day" | "month" | "year",
              "free_sample"
            );
          } catch (err) {
            console.error(`Failed to assign Free plan to user ${user._id}`, err);
          }
        }

        if (subscription) {
          subscription = await subscription.populateFull();
        }

        return {
          user,
          subscription,
          status: subscription?.status || "new",
          trial_type: subscription?.trial_type || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      subscriptions,
      total: totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GET SUBSCRIPTION BY ID =================
export const getUserSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await userSubscriptionService.getById(id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    return res.json({ success: true, subscription });
  } catch (error) {
    console.error("Get subscription by ID error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= CREATE NEW SUBSCRIPTION =================
export const addUserSubscription = async (req: Request, res: Response) => {
  try {
    const { user_id, plan_id, trial_type } = req.body;

    if (!user_id || !plan_id) {
      return res.status(400).json({ success: false, message: "user_id and plan_id are required" });
    }

    const planDoc = await SubscriptionPlan.findById(plan_id);
    if (!planDoc) {
      return res.status(400).json({ success: false, message: "Invalid plan_id" });
    }

    const subscription = await userSubscriptionService.createOrUpdateSubscription(
      user_id,
      planDoc._id.toString(),
      planDoc.duration.value,
      planDoc.duration.unit as "day" | "month" | "year",
      trial_type
    );

    return res.status(201).json({ success: true, subscription });
  } catch (error) {
    console.error("Create subscription error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= UPDATE SUBSCRIPTION =================
export const updateUserSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await userSubscriptionService.update(id, req.body);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    return res.json({ success: true, subscription });
  } catch (error) {
    console.error("Update subscription error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= TOGGLE ACTIVE/INACTIVE =================
export const toggleUserSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await userSubscriptionService.toggleActiveStatus(id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    return res.json({
      success: true,
      message: subscription.is_active
        ? "Subscription activated successfully"
        : "Subscription deactivated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Toggle subscription status error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= SOFT DELETE =================
export const deleteUserSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await userSubscriptionService.softDelete(id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    return res.json({
      success: true,
      message: "Subscription soft deleted successfully",
      subscription,
    });
  } catch (error) {
    console.error("Delete subscription error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= RESTORE SOFT DELETE =================
export const restoreUserSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await userSubscriptionService.restore(id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    return res.json({
      success: true,
      message: "Subscription restored successfully",
      subscription,
    });
  } catch (error) {
    console.error("Restore subscription error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
