// models/Newsletter.js
import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Newsletter", newsletterSchema);
