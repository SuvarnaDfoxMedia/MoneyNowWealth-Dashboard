import express from "express";
import {
  getSubscriptionPaymentById,
  addSubscriptionPayment,
  updateSubscriptionPayment,
  deleteSubscriptionPayment,
  toggleSubscriptionPaymentStatus,
  restoreSubscriptionPayment,
 
getUserSubscriptionPayments} from "../controllers/userSubscriptionPaymentController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();

/* ---------------------------------------------------
   Public Routes (any logged-in user)
--------------------------------------------------- */
router.get("/subscription-payment/:id", getSubscriptionPaymentById);


/* ---------------------------------------------------
   Admin Routes (protected by role middleware)
--------------------------------------------------- */
const adminMiddleware = roleFromUrl(["admin"]);

// Create a new payment
router.post("/subscription-payment/create", addSubscriptionPayment);
// router.get("/user/:user_id/subscription-payments", getUserPayments); // Update a payment

// router.get("/:role/user/:user_id/subscription-payments", adminMiddleware, getUserPayments); 
router.put("/subscription-payment/edit/:id", updateSubscriptionPayment);
// Fetch all subscription payments for a user
// router.get("/:role/user/:user_id/subscription-payments", adminMiddleware, getUserSubscriptionPayments);

router.get(
  "/:role/subscription/:subscription_id/payments",
  adminMiddleware,
  getUserSubscriptionPayments
);
// Toggle payment status (active/inactive)
router.patch("/:role/subscription-payment/change/:id/status", adminMiddleware, toggleSubscriptionPaymentStatus);

// Soft delete a payment
router.delete("/:role/subscription-payment/delete/:id", adminMiddleware, deleteSubscriptionPayment);

// Restore a deleted payment
router.patch("/:role/subscription-payment/restore/:id", adminMiddleware, restoreSubscriptionPayment);


export default router;
