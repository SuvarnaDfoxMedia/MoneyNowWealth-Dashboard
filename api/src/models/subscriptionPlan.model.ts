import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string; // any plan name allowed
  description?: string;
  price: number;
  currency: string;
  duration: {
    value: number;
    unit: "day" | "month" | "year"; // singular units only
  };
  features: string[];
  is_active: boolean;
  is_deleted: boolean;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, trim: true }, // removed enum
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ["day", "month", "year"], required: true }, // singular
    },
    features: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for frequent queries
SubscriptionPlanSchema.index({ name: 1, is_active: 1 });

// Virtual to check if plan is active
SubscriptionPlanSchema.virtual("isActive").get(function () {
  return this.is_active && !this.is_deleted;
});

export default mongoose.model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);
