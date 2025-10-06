import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, unique: true }, // Title
    slug: { type: String, required: true, unique: true },
    alt_tag: String,
    title_tag: String,
    description: String,
    for_home: { type: String, enum: ["Yes", "No"], default: "No" },
    seo_title: String,
    seo_meta_description: String,
    seo_keywords: String,
    page_schema: String,
    og_tags: String,
    image: String,
    publish_date: { type: Date }, // New field
    is_active: { type: Number, default: 1 }, // 1 = active, 0 = inactive, 2 = deleted
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
