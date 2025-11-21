


// import mongoose, { Schema, Document, Model } from "mongoose";

// // ---------------------------------------
// // Interface
// // ---------------------------------------
// export interface IUserSubscriptionPayment extends Document {
//   user_id: mongoose.Types.ObjectId;
//   subscription_id: mongoose.Types.ObjectId;
//   plan_id: mongoose.Types.ObjectId;
//   amount: number;
//   currency: string;
//   payment_method: string;
//   type: "payment" | "manual" | "refund";
//   note?: string;
//   subscription_status?: "new" | "upgrade" | "downgrade";
//   createdAt: Date;
//   updatedAt: Date;
// }

// // ---------------------------------------
// // Static Model Interface
// // ---------------------------------------
// export interface IUserSubscriptionPaymentModel
//   extends Model<IUserSubscriptionPayment> {
//   createPaymentForSubscription(
//     userId: mongoose.Types.ObjectId | string,
//     subscriptionId: mongoose.Types.ObjectId | string,
//     planId: mongoose.Types.ObjectId | string,
//     amount: number,
//     currency: string,
//     paymentMethod: string,
//     type: "payment" | "manual" | "refund",
//     extra?: {
//       note?: string;
//       subscription_status?: "new" | "upgrade" | "downgrade";
//     }
//   ): Promise<IUserSubscriptionPayment>;

//   getPaymentsByUser(
//     userId: mongoose.Types.ObjectId | string
//   ): Promise<IUserSubscriptionPayment[]>;
// }

// // ---------------------------------------
// // Schema
// // ---------------------------------------
// const userSubscriptionPaymentSchema =
//   new Schema<IUserSubscriptionPayment, IUserSubscriptionPaymentModel>(
//     {
//       user_id: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//         index: true,
//       },
//       subscription_id: {
//         type: Schema.Types.ObjectId,
//         ref: "UserSubscription",
//         required: true,
//         index: true,
//       },
//       plan_id: {
//         type: Schema.Types.ObjectId,
//         ref: "SubscriptionPlan",
//         required: true,
//       },
//       amount: { type: Number, required: true },
//       currency: { type: String, required: true },
//       payment_method: { type: String, required: true },
//       type: {
//         type: String,
//         enum: ["payment", "manual", "refund"],
//         required: true,
//       },
//       note: { type: String },
//       subscription_status: {
//         type: String,
//         enum: ["new", "upgrade", "downgrade"],
//         default: "new",
//       },
//     },
//     { timestamps: true }
//   );

// // ---------------------------------------
// // Static Methods
// // ---------------------------------------
// userSubscriptionPaymentSchema.statics.createPaymentForSubscription =
//   async function (
//     userId,
//     subscriptionId,
//     planId,
//     amount,
//     currency,
//     paymentMethod,
//     type,
//     extra = {}
//   ) {
//     return this.create({
//       user_id: userId,
//       subscription_id: subscriptionId,
//       plan_id: planId,
//       amount,
//       currency,
//       payment_method: paymentMethod,
//       type,
//       ...extra,
//     });
//   };

// // Fetch all payments by user
// userSubscriptionPaymentSchema.statics.getPaymentsByUser =
//   async function (userId) {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       throw new Error("Invalid user ID");
//     }

//     return this.find({ user_id: new mongoose.Types.ObjectId(userId) })
//       .populate("subscription_id plan_id") // populate subscription & plan details
//       .sort({ createdAt: -1 }); // latest payments first
//   };

// // ---------------------------------------
// // Index
// // ---------------------------------------
// userSubscriptionPaymentSchema.index({
//   user_id: 1,
//   subscription_id: 1,
//   createdAt: -1,
// });

// // ---------------------------------------
// // Model Export
// // ---------------------------------------
// const UserSubscriptionPayment =
//   (mongoose.models.UserSubscriptionPayment as IUserSubscriptionPaymentModel) ||
//   mongoose.model<IUserSubscriptionPayment, IUserSubscriptionPaymentModel>(
//     "UserSubscriptionPayment",
//     userSubscriptionPaymentSchema
//   );

// export default UserSubscriptionPayment;




import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserSubscriptionPayment extends Document {
  user_id: Types.ObjectId;
  plan_id: Types.ObjectId;
  user_subscription_id: Types.ObjectId;

  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  order_id: string;

  payment_status: "pending" | "success" | "failed" | "refunded";
  payment_date: Date;

  type: "new" | "renewal" | "upgrade" | "downgrade";

  metadata: {
    gateway_response: any;
    invoice_url?: string;
  };

  created_at: Date;
  updated_at: Date;
}

// ---------------------------------------
// Static Interface
// ---------------------------------------
export interface IUserSubscriptionPaymentModel
  extends Model<IUserSubscriptionPayment> {
  createPaymentForSubscription(data: Partial<IUserSubscriptionPayment>): Promise<IUserSubscriptionPayment>;
  getPaymentsByUser(userId: Types.ObjectId | string): Promise<IUserSubscriptionPayment[]>;
}

// ---------------------------------------
// Schema
// ---------------------------------------
const userSubscriptionPaymentSchema = new Schema<IUserSubscriptionPayment, IUserSubscriptionPaymentModel>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan_id: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    user_subscription_id: { type: Schema.Types.ObjectId, ref: "UserSubscription", required: true, index: true },

    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    payment_method: { type: String, required: true },
    transaction_id: { type: String, required: true },
    order_id: { type: String, required: true },

    payment_status: { type: String, enum: ["pending", "success", "failed", "refunded"], required: true },
    payment_date: { type: Date, required: true, default: Date.now },

    type: { type: String, enum: ["new", "renewal", "upgrade", "downgrade"], required: true },

    metadata: { type: Object, default: {} },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// ---------------------------------------
// Static Methods
// ---------------------------------------
userSubscriptionPaymentSchema.statics.createPaymentForSubscription = async function (data) {
  return this.create(data);
};

userSubscriptionPaymentSchema.statics.getPaymentsByUser = async function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");
  return this.find({ user_id: new mongoose.Types.ObjectId(userId) })
    .populate("user_subscription_id plan_id")
    .sort({ created_at: -1 });
};

// ---------------------------------------
// Index
// ---------------------------------------
userSubscriptionPaymentSchema.index({ user_id: 1, user_subscription_id: 1, created_at: -1 });

// ---------------------------------------
// Export Model
// ---------------------------------------
const UserSubscriptionPayment =
  mongoose.models.UserSubscriptionPayment ||
  mongoose.model<IUserSubscriptionPayment, IUserSubscriptionPaymentModel>(
    "UserSubscriptionPayment",
    userSubscriptionPaymentSchema
  );

export default UserSubscriptionPayment;
