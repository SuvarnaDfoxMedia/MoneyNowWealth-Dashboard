// import express from "express";
// import {
//   addSubscriptionPayment,
//   updateSubscriptionPayment,
//   getSubscriptionPaymentById,
// } from "../controllers/userSubscriptionPaymentController";

// import { roleFromUrl } from "../middlewares/roleUrlMiddleware";

// const router = express.Router();


// // Get a specific subscription payment by ID
// router.get("/subscription-payment/:id", getSubscriptionPaymentById);


// const adminMiddleware = roleFromUrl(["admin"]);

// // Create a new subscription payment
// router.post("/subscription-payment/create", adminMiddleware, addSubscriptionPayment);

// // Update an existing subscription payment
// router.put("/subscription-payment/edit/:id", adminMiddleware, updateSubscriptionPayment);

// // Fetch all subscription payments for a specific subscription
// router.get(
//   "/subscription/:subscription_id/payments",
//   getSubscriptionPaymentById
// );


// export default router;


import express from "express";
import {
  addSubscriptionPayment,
  updateSubscriptionPayment,
  getSubscriptionPaymentById,
  getLatestPaymentByUser
} from "../controllers/userSubscriptionPaymentController";

import { roleFromUrl } from "../middlewares/roleUrlMiddleware";

const router = express.Router();

/* -------------------- PUBLIC ROUTES -------------------- */
// Get a specific subscription payment by ID
router.get("/subscription-payment/:id", getSubscriptionPaymentById);

// Fetch all subscription payments for a specific subscription
router.get("/subscription/:subscription_id/payments", getSubscriptionPaymentById);

/* -------------------- ADMIN ROUTES -------------------- */
const adminMiddleware = roleFromUrl(["admin"]);

/* -------------------- CREATE -------------------- */
router.post(
  "/:role/subscription-payment/create",
  ...adminMiddleware,
  addSubscriptionPayment
);

/* -------------------- UPDATE -------------------- */
router.put(
  "/:role/subscription-payment/edit/:id",
  ...adminMiddleware,
  updateSubscriptionPayment
);

// GET latest payment by user ID
router.get("/:role/subscription-payment/user/:user_id/latest",   ...adminMiddleware,
 getLatestPaymentByUser);


export default router;
