import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  is_active: { type: Number, default: 1 }, // 1 = active, 0 = inactive
});

export default mongoose.model("BlogCategory", blogCategorySchema);
