import mongoose, { Document, Schema, Model } from "mongoose";

/* ---------------------------------------------------
   Newsletter Interface
--------------------------------------------------- */
export interface INewsletter extends Document {
  _id: mongoose.Types.ObjectId;
  newsletter_code: string;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  is_active: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/* ---------------------------------------------------
   Schema Definition
--------------------------------------------------- */
const newsletterSchema = new Schema<INewsletter>(
  {
    newsletter_code: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    is_active: { type: Number, default: 1 },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

/* ---------------------------------------------------
   Pre-Validate Hook to Generate Unique newsletter_code
--------------------------------------------------- */
newsletterSchema.pre("validate", function (next) {
  if (!this.newsletter_code) {
    // Example: NL + timestamp + random 3 digits
    this.newsletter_code = "NL" + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

/* ---------------------------------------------------
   Soft Delete Method
--------------------------------------------------- */
newsletterSchema.statics.softDelete = async function (id: string) {
  const newsletter = await this.findById(id);
  if (!newsletter) throw new Error("Newsletter not found");

  newsletter.is_deleted = true;
  newsletter.is_active = 0;
  newsletter.deleted_at = new Date();

  await newsletter.save();
  return newsletter;
};

/* ---------------------------------------------------
   Toggle Active/Inactive
--------------------------------------------------- */
newsletterSchema.statics.toggleActive = async function (id: string) {
  const newsletter = await this.findById(id);
  if (!newsletter) throw new Error("Newsletter not found");

  newsletter.is_active = newsletter.is_active === 1 ? 0 : 1;
  await newsletter.save();
  return newsletter;
};

/* ---------------------------------------------------
   Auto Filter Deleted Records
--------------------------------------------------- */
newsletterSchema.pre(/^find/, function (next) {
  this.where({ is_deleted: false });
  next();
});

/* ---------------------------------------------------
   Prevent Physical Delete
--------------------------------------------------- */
newsletterSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    this.is_deleted = true;
    this.is_active = 0;
    this.deleted_at = new Date();
    await this.save();
    next(new Error("Soft delete: document not actually removed"));
  }
);

/* ---------------------------------------------------
   Indexes
--------------------------------------------------- */
newsletterSchema.index({ is_active: 1, is_deleted: 1, status: 1 });

/* ---------------------------------------------------
   Model Export
--------------------------------------------------- */
const Newsletter: Model<INewsletter> & {
  softDelete(id: string): Promise<INewsletter>;
  toggleActive(id: string): Promise<INewsletter>;
} = mongoose.model<INewsletter>("Newsletter", newsletterSchema) as any;

export default Newsletter;
