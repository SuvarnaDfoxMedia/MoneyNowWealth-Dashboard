


// import mongoose from "mongoose";
// import express from "express";
// import { userSubscriptionPaymentService } from "../services/userSubscriptionPaymentService.ts";
// import { userSubscriptionService } from "../services/userSubscriptionService.ts";
// import SubscriptionPlanModel from "../models/subscriptionPlan.model.ts";
// import UserSubscriptionPayment from "../models/userSubscriptionPaymentModel.ts";

// type Request = express.Request;
// type Response = express.Response;



// // ============================================================
// // POST: Create Subscription Payment + Update Subscription
// // ============================================================
// export const addSubscriptionPayment = async (req: Request, res: Response) => {
//   try {
//     const {
//       user_id,
//       plan_id,
//       amount,
//       currency,
//       payment_method,
//       type,
//       user_subscription_id,
//       metadata,
//     } = req.body;

//     if (!user_id || !plan_id || !type) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: user_id, plan_id, type",
//       });
//     }

//     const plan = await SubscriptionPlanModel.findById(plan_id).lean();
//     if (!plan) return res.status(400).json({ success: false, message: "Plan not found" });

//     const isFreePlan = plan.name === "Free";

//     // 1️⃣ Save payment entry
//     const payment = await userSubscriptionPaymentService.create({
//       user_id: new mongoose.Types.ObjectId(user_id),
//       plan_id: new mongoose.Types.ObjectId(plan_id),
//       user_subscription_id: user_subscription_id
//         ? new mongoose.Types.ObjectId(user_subscription_id)
//         : null,
//       amount: isFreePlan ? 0 : amount,
//       currency: currency || "INR",
//       payment_method: isFreePlan ? "free" : payment_method,
//       type,
//       metadata: metadata || {},
//     });

//     // 2️⃣ Update Subscription if subscription exists
//     let updatedSubscription = null;
//     if (user_subscription_id) {
//       updatedSubscription = await userSubscriptionService.createOrUpdateSubscription(
//         user_id,
//         plan,
//         {
//           trialType: isFreePlan ? "free_sample" : undefined,
//           amount: isFreePlan ? 0 : amount,
//           currency: currency || "INR",
//           note: "Payment created via API",
//         }
//       );
//     }

//     res.status(201).json({
//       success: true,
//       message: "Subscription payment created successfully",
//       data: payment,
//       subscription: updatedSubscription,
//     });
//   } catch (error: any) {
//     console.error("Error creating subscription payment:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create subscription payment",
//     });
//   }
// };

// // ============================================================
// // GET PAYMENT BY ID
// // ============================================================
// export const getSubscriptionPaymentById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const payment = await userSubscriptionPaymentService.getById(id);
//     if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

//     const populatedPayment = await UserSubscriptionPayment.populate(payment, {
//       path: "plan_id",
//       select: "name price duration currency",
//     });

//     res.json({ success: true, message: "Subscription payment fetched successfully", data: populatedPayment });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message || "Failed to fetch payment" });
//   }
// };

// // ============================================================
// // UPDATE PAYMENT
// // ============================================================
// export const updateSubscriptionPayment = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updated = await userSubscriptionPaymentService.update(id, req.body);

//     if (!updated)
//       return res.status(404).json({ success: false, message: "Payment not found or cannot update" });

//     res.json({ success: true, message: "Subscription payment updated successfully", data: updated });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message || "Failed to update subscription payment" });
//   }
// };

// // ============================================================
// // SOFT DELETE PAYMENT
// // ============================================================
// export const deleteSubscriptionPayment = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deleted = await userSubscriptionPaymentService.softDelete(id);
//     if (!deleted) return res.status(404).json({ success: false, message: "Payment not found" });

//     res.json({ success: true, message: "Subscription payment soft deleted successfully", data: deleted });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message || "Failed to delete payment" });
//   }
// };

// // ============================================================
// // RESTORE PAYMENT
// // ============================================================
// export const restoreSubscriptionPayment = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const restored = await userSubscriptionPaymentService.restore(id);
//     if (!restored) return res.status(404).json({ success: false, message: "Payment not found or cannot be restored" });

//     res.json({ success: true, message: "Subscription payment restored successfully", data: restored });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message || "Failed to restore payment" });
//   }
// };

// // ============================================================
// // TOGGLE PAYMENT STATUS
// // ============================================================
// export const toggleSubscriptionPaymentStatus = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updated = await userSubscriptionPaymentService.toggleStatus(id);
//     if (!updated) return res.status(404).json({ success: false, message: "Payment not found or cannot toggle status" });

//     res.json({ success: true, message: "Subscription payment status toggled successfully", data: updated });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message || "Failed to toggle payment status" });
//   }
// };



// export const getUserPayments = async (req: any, res: any) => {
//   try {
//     const { user_id } = req.params;
//     const { page = 1, limit = 50 } = req.query;

//     if (!mongoose.Types.ObjectId.isValid(user_id)) {
//       return res.status(400).json({ success: false, message: "Invalid user_id" });
//     }

//     const filters = {
//       user_id: new mongoose.Types.ObjectId(user_id),
//       type: { $in: ["new", "upgrade", "downgrade"] }, // fetch all relevant types
//       is_deleted: false, // only non-deleted payments
//     };

//     const { payments, total, totalPages } = await userSubscriptionPaymentService.getAll({
//       filters,
//       page: Number(page),
//       limit: Number(limit),
//     });

//     res.status(200).json({
//       success: true,
//       message: "User subscription payments fetched successfully",
//       data: payments,
//       total,
//       page: Number(page),
//       totalPages,
//     });
//   } catch (err: any) {
//     console.error("Error fetching user payments:", err);
//     res.status(500).json({ success: false, message: err.message || "Failed to fetch user payments" });
//   }
// };




// export const getSubscriptionPayments = async (req, res) => {
//   try {
//     const { subscription_id } = req.params;
//     const { page = 1, limit = 10 } = req.query;

//     if (!mongoose.Types.ObjectId.isValid(subscription_id)) {
//       return res.status(400).json({ success: false, message: "Invalid subscription ID" });
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     // Filters
//     const filters: any = {
//       subscription_id: new mongoose.Types.ObjectId(subscription_id),
//       type: "payment",
//     };

//     const [total, payments] = await Promise.all([
//       UserSubscriptionPayment.countDocuments(filters),

//       UserSubscriptionPayment.find(filters)
//         .populate("plan_id", "name price currency duration") //  fetch plan details
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//     ]);

//     return res.json({
//       success: true,
//       message: "Subscription payments fetched successfully",
//       data: payments,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//     });
//   } catch (error) {
//     console.error("getSubscriptionPayments error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };



import mongoose from "mongoose";
import express from "express";
import { userSubscriptionPaymentService } from "../services/userSubscriptionPaymentService.ts";
import { userSubscriptionService } from "../services/userSubscriptionService.ts";
import SubscriptionPlanModel from "../models/subscriptionPlan.model.ts";
import UserSubscriptionPayment from "../models/userSubscriptionPaymentModel.ts";
import UserSubscription from "../models/userSubscriptionModel.ts";


type Request = express.Request;
type Response = express.Response;

// ============================================================
// POST: Create Subscription Payment + Update Subscription
// ============================================================
export const addSubscriptionPayment = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      plan_id,
      amount,
      currency,
      payment_method,
      type,
      user_subscription_id,
      metadata,
    } = req.body;

    if (!user_id || !plan_id || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, plan_id, type",
      });
    }

    const plan = await SubscriptionPlanModel.findById(plan_id).lean();
    if (!plan) return res.status(400).json({ success: false, message: "Plan not found" });

    const isFreePlan = plan.name.toLowerCase() === "free";

    // 1️⃣ Save payment entry
    const payment = await userSubscriptionPaymentService.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      plan_id: new mongoose.Types.ObjectId(plan_id),
      subscription_id: user_subscription_id
        ? new mongoose.Types.ObjectId(user_subscription_id)
        : null,
      amount: isFreePlan ? 0 : amount,
      currency: currency || "INR",
      payment_method: isFreePlan ? "free" : payment_method,
      type,
      metadata: metadata || {},
    });

    // 2️⃣ Update Subscription if subscription exists
    let updatedSubscription = null;
    if (user_subscription_id) {
      updatedSubscription = await userSubscriptionService.createOrUpdateSubscription(
        user_id,
        plan,
        {
          trialType: isFreePlan ? "free_sample" : undefined,
          amount: isFreePlan ? 0 : amount,
          currency: currency || "INR",
          note: "Payment created via API",
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Subscription payment created successfully",
      data: payment,
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("Error creating subscription payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create subscription payment",
    });
  }
};

// ============================================================
// GET PAYMENT BY ID
// ============================================================
export const getSubscriptionPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await userSubscriptionPaymentService.getById(id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    const populatedPayment = await UserSubscriptionPayment.populate(payment, {
      path: "plan_id",
      select: "name price duration currency",
    });

    res.json({ success: true, message: "Subscription payment fetched successfully", data: populatedPayment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch payment" });
  }
};

// ============================================================
// UPDATE PAYMENT
// ============================================================
export const updateSubscriptionPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await userSubscriptionPaymentService.update(id, req.body);

    if (!updated)
      return res.status(404).json({ success: false, message: "Payment not found or cannot update" });

    res.json({ success: true, message: "Subscription payment updated successfully", data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update subscription payment" });
  }
};

// ============================================================
// SOFT DELETE PAYMENT
// ============================================================
export const deleteSubscriptionPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await userSubscriptionPaymentService.softDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Payment not found" });

    res.json({ success: true, message: "Subscription payment soft deleted successfully", data: deleted });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to delete payment" });
  }
};

// ============================================================
// RESTORE PAYMENT
// ============================================================
export const restoreSubscriptionPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const restored = await userSubscriptionPaymentService.restore(id);
    if (!restored) return res.status(404).json({ success: false, message: "Payment not found or cannot be restored" });

    res.json({ success: true, message: "Subscription payment restored successfully", data: restored });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to restore payment" });
  }
};

// ============================================================
// TOGGLE PAYMENT STATUS
// ============================================================
export const toggleSubscriptionPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await userSubscriptionPaymentService.toggleStatus(id);
    if (!updated) return res.status(404).json({ success: false, message: "Payment not found or cannot toggle status" });

    res.json({ success: true, message: "Subscription payment status toggled successfully", data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to toggle payment status" });
  }
};



// export const getUserSubscriptionPayments = async (req: Request, res: Response) => {
//   try {
//     const { user_id } = req.params;
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     if (!mongoose.Types.ObjectId.isValid(user_id)) {
//       return res.status(400).json({ success: false, message: "Invalid user ID" });
//     }

//     // 1️⃣ Fetch all subscriptions
//     const subscriptions = await UserSubscription.find({ user_id, is_deleted: false })
//       .populate("plan_id", "name price duration currency");

//     if (subscriptions.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No subscriptions found",
//         data: [],
//         total: 0,
//         page,
//         totalPages: 0,
//       });
//     }

//     const subscriptionIds = subscriptions.map(sub => sub._id);

//     // 2️⃣ Fetch payments for these subscriptions
//     const payments = await UserSubscriptionPayment.find({
//       user_subscription_id: { $in: subscriptionIds },
//       is_deleted: false,
//     })
//       .populate("user_id", "firstname lastname email mobile")
//       .populate("plan_id", "name price duration currency")
//       .populate("user_subscription_id");

//     // 3️⃣ Map subscriptionId → payments
//     const paymentMap: Record<string, any[]> = {};
//     payments.forEach(payment => {
//       const subId = payment.user_subscription_id._id.toString();
//       if (!paymentMap[subId]) paymentMap[subId] = [];
//       paymentMap[subId].push(payment);
//     });

//     // 4️⃣ Combine subscriptions + payments
//     const allData: any[] = [];
//     subscriptions.forEach(sub => {
//       const subPayments = paymentMap[sub._id.toString()] || [];
//       if (subPayments.length > 0) {
//         subPayments.forEach(payment => {
//           allData.push({
//             payment_id: payment._id,
//             amount: payment.amount,
//             status: payment.payment_status,
//             payment_method: payment.payment_method,
//             payment_date: payment.payment_date,
//             user: payment.user_id
//               ? {
//                   firstname: payment.user_id.firstname,
//                   lastname: payment.user_id.lastname,
//                   email: payment.user_id.email,
//                   mobile: payment.user_id.mobile,
//                 }
//               : null,
//             plan: payment.plan_id
//               ? {
//                   name: payment.plan_id.name,
//                   price: payment.plan_id.price,
//                   duration: payment.plan_id.duration,
//                   currency: payment.plan_id.currency,
//                 }
//               : null,
//             subscription: {
//               id: sub._id,
//               start_date: sub.start_date,
//               end_date: sub.end_date,
//               plan_type: sub.plan_type,
//               status: sub.status,
//             },
//           });
//         });
//       } else {
//         // No payments → include subscription itself as default
//         allData.push({
//           payment_id: null,
//           amount: 0,
//           status: sub.status || "new",
//           payment_method: sub.plan_type === "Free" ? "free_plan" : null,
//           payment_date: sub.created_at,
//           user: {
//             firstname: "", // optionally fetch user info if needed
//             lastname: "",
//             email: "",
//             mobile: "",
//           },
//           plan: sub.plan_id
//             ? {
//                 name: sub.plan_id.name,
//                 price: sub.plan_id.price,
//                 duration: sub.plan_id.duration,
//                 currency: sub.plan_id.currency,
//               }
//             : null,
//           subscription: {
//             id: sub._id,
//             start_date: sub.start_date,
//             end_date: sub.end_date,
//             plan_type: sub.plan_type,
//             status: sub.status,
//           },
//         });
//       }
//     });

//     // 5️⃣ Pagination
//     const total = allData.length;
//     const paginated = allData.slice((page - 1) * limit, page * limit);

//     return res.status(200).json({
//       success: true,
//       message: "User subscription payments fetched successfully",
//       data: paginated,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error: any) {
//     console.error("getUserSubscriptionPayments error:", error);
//     return res.status(500).json({ success: false, message: error.message || "Server error" });
//   }
// };


export const getUserSubscriptionPayments = async (req: Request, res: Response) => {
  try {
    const { subscription_id } = req.params; // fetch by subscription ID
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(subscription_id)) {
      return res.status(400).json({ success: false, message: "Invalid subscription ID" });
    }

    // 1️⃣ Fetch the subscription
    const subscription = await UserSubscription.findOne({ _id: subscription_id, is_deleted: false })
      .populate("plan_id", "name price duration currency")
      .populate("user_id", "firstname lastname email mobile"); // populate user

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: "Subscription not found",
        data: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }

    // 2️⃣ Fetch payments for this subscription
    const payments = await UserSubscriptionPayment.find({
      user_subscription_id: subscription_id,
      is_deleted: false,
    })
      .populate("user_id", "firstname lastname email mobile")
      .populate("plan_id", "name price duration currency")
      .populate("user_subscription_id");

    const allData: any[] = [];

    if (payments.length > 0) {
      payments.forEach(payment => {
        allData.push({
          payment_id: payment._id,
          amount: payment.amount,
          status: payment.payment_status,
          payment_method: payment.payment_method,
          payment_date: payment.payment_date,
          user: payment.user_id
            ? {
                firstname: payment.user_id.firstname,
                lastname: payment.user_id.lastname,
                email: payment.user_id.email,
                mobile: payment.user_id.mobile,
              }
            : subscription.user_id // fallback to subscription user
            ? {
                firstname: subscription.user_id.firstname,
                lastname: subscription.user_id.lastname,
                email: subscription.user_id.email,
                mobile: subscription.user_id.mobile,
              }
            : { firstname: "", lastname: "", email: "", mobile: "" },
          plan: payment.plan_id
            ? {
                name: payment.plan_id.name,
                price: payment.plan_id.price,
                duration: payment.plan_id.duration,
                currency: payment.plan_id.currency,
              }
            : null,
          subscription: {
            id: subscription._id,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            plan_type: subscription.plan_type,
            status: subscription.status,
          },
        });
      });
    } else {
      // No payments → include subscription itself as default
      allData.push({
        payment_id: null,
        amount: 0,
        status: subscription.status || "new",
        payment_method: subscription.plan_type === "Free" ? "free_plan" : null,
        payment_date: subscription.created_at,
        user: subscription.user_id
          ? {
              firstname: subscription.user_id.firstname,
              lastname: subscription.user_id.lastname,
              email: subscription.user_id.email,
              mobile: subscription.user_id.mobile,
            }
          : {
              firstname: "",
              lastname: "",
              email: "",
              mobile: "",
            },
        plan: subscription.plan_id
          ? {
              name: subscription.plan_id.name,
              price: subscription.plan_id.price,
              duration: subscription.plan_id.duration,
              currency: subscription.plan_id.currency,
            }
          : null,
        subscription: {
          id: subscription._id,
          start_date: subscription.start_date,
          end_date: subscription.end_date,
          plan_type: subscription.plan_type,
          status: subscription.status,
        },
      });
    }

    // 3️⃣ Pagination
    const total = allData.length;
    const paginated = allData.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      success: true,
      message: "Subscription payments fetched successfully",
      data: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("getUserSubscriptionPayments error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
