import mongoose, { Document, Schema, Model } from "mongoose";

export interface IContactEnquiry extends Document {
  name: string;
  email: string;
  mobile: string;
  subject: "Support" | "Partner" | "Feedback" | "Others";
  message: string;
  status: "new" | "in-progress" | "resolved";
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

const contactEnquirySchema = new Schema<IContactEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    subject: { type: String, enum: ["Support", "Partner", "Feedback", "Others"], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "in-progress", "resolved"], default: "new" },
    is_active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

contactEnquirySchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const ContactEnquiry: Model<IContactEnquiry> = mongoose.model<IContactEnquiry>(
  "ContactEnquiry",
  contactEnquirySchema
);

// ✅ Export interface explicitly
export type { IContactEnquiry };
