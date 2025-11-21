import express from "express";
import {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
toggleSubscriptionPlanStatus,
} from "../controllers/subscriptionPlanController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();

// Public routes
router.get("/subscription-plan", getSubscriptionPlans); // list all plans
router.get("/subscription-plan/:id", getSubscriptionPlanById); // get single plan

// Admin/editor middleware
const adminEditorMiddleware = roleFromUrl(["admin"]);

// Admin routes
router.post("/:role/subscription-plan/create", adminEditorMiddleware, addSubscriptionPlan);
router.put("/:role/subscription-plan/edit/:id", adminEditorMiddleware, updateSubscriptionPlan);
router.patch("/:role/subscription-plan/change/:id/status", adminEditorMiddleware, toggleSubscriptionPlanStatus);
router.delete("/:role/subscription-plan/delete/:id", adminEditorMiddleware, deleteSubscriptionPlan);

export default router;
