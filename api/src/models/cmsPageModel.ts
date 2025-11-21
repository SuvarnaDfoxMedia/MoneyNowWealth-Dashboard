import mongoose, { Document, Schema, Model } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

export interface ISection {
  title?: string;
  content?: string;
  images?: string[];
  videos?: string[];
  cta?: { text?: string; url?: string };
}

export interface IFaq {
  question?: string;
  answer?: string;
}

export interface ICmsPage extends Document {
  _id: mongoose.Types.ObjectId;
  page_code: string;
  page_number: number;
  title: string;
  slug: string;
  sections?: ISection[];
  faqs?: IFaq[];
  status: "draft" | "published" | "archived";
  is_active: number;
  is_deleted: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const cmsPageSchema = new Schema<ICmsPage>(
  {
    page_code: { type: String, unique: true, index: true },
    page_number: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    sections: { type: [Object], default: [] },
    faqs: { type: [Object], default: [] },
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

const AutoIncrement = AutoIncrementFactory(mongoose);

cmsPageSchema.plugin(AutoIncrement, {
  id: "cms_page_seq",
  inc_field: "page_number",
  start_seq: 1,
});

cmsPageSchema.post("save", async function (doc, next) {
  if (!doc.page_code && doc.page_number) {
    const number = String(doc.page_number).padStart(3, "0");
    doc.page_code = `PAGE_${number}`;
    await doc.updateOne({ page_code: doc.page_code });
  }
  next();
});

cmsPageSchema.index({ is_active: 1, is_deleted: 1, status: 1, created_at: -1 });

cmsPageSchema.statics.softDelete = async function (id: string) {
  const page = await this.findById(id);
  if (!page) throw new Error("CMS Page not found");
  page.is_deleted = true;
  page.is_active = 0;
  page.deleted_at = new Date();
  await page.save();
  return page;
};

cmsPageSchema.pre(/^find/, function (next) {
  this.where({ is_deleted: false });
  next();
});

cmsPageSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  // @ts-ignore
  this.is_deleted = true;
  // @ts-ignore
  this.is_active = 0;
  // @ts-ignore
  this.deleted_at = new Date();
  await this.save();
  next(new Error("Soft delete: document not actually removed"));
});

const CmsPage: Model<ICmsPage> & { softDelete(id: string): Promise<ICmsPage> } =
  mongoose.model<ICmsPage>("CmsPage", cmsPageSchema) as any;

export default CmsPage;
