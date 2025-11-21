import express from "express";
import {
  getUserSubscriptions,
  getUserSubscriptionById,
  addUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
  toggleUserSubscriptionStatus,
  restoreUserSubscription,
} from "../controllers/userSubscriptionController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();
const adminMiddleware = roleFromUrl(["admin"]);

router.get("/subscriptions", getUserSubscriptions);
router.get("/subscriptions/:id", getUserSubscriptionById);

router.get("/:role/subscriptions", adminMiddleware, getUserSubscriptions);

router.post("/:role/subscriptions/create", adminMiddleware, addUserSubscription);
router.put("/:role/subscriptions/edit/:id", adminMiddleware, updateUserSubscription);
router.patch("/:role/subscriptions/change/:id/status", adminMiddleware, toggleUserSubscriptionStatus);
router.delete("/:role/subscriptions/delete/:id", adminMiddleware, deleteUserSubscription);
router.patch("/:role/subscriptions/:id/restore", adminMiddleware, restoreUserSubscription);

export default router;


