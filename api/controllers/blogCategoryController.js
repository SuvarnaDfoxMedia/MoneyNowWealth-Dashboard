import BlogCategory from "../models/BlogCategory.js";

// Create or update category
export const saveCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    let category;

    if (!id) {
      // CREATE
      const exists = await BlogCategory.findOne({ name: name.trim(), is_active: 1 });
      if (exists) {
        return res.status(400).json({ success: false, message: "Category already exists", code: 11000 });
      }

      category = new BlogCategory({
        name: name.trim(),
        image: req.file?.filename || "",
        is_active: 1,
      });
    } else {
      // UPDATE
      category = await BlogCategory.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      // Check for duplicate name
      const exists = await BlogCategory.findOne({ _id: { $ne: id }, name: name.trim(), is_active: 1 });
      if (exists) {
        return res.status(400).json({ success: false, message: "Category name already exists", code: 11000 });
      }

      category.name = name.trim();

      if (req.file) {
        category.image = req.file.filename;
      }
    }

    await category.save();
    res.json({ success: true, category });
  } catch (err) {
    console.error("Error in saveCategory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all active categories
export const getCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find({ is_active: 1 }).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    console.error("Error in getCategories:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get category by ID (only active)
export const getCategoryById = async (req, res) => {
  try {
    const category = await BlogCategory.findOne({ _id: req.params.id, is_active: 1 });
    if (!category) return res.status(404).json({ success: false, message: "Category not found or inactive" });
    res.json({ success: true, category });
  } catch (err) {
    console.error("Error in getCategoryById:", err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Soft delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findByIdAndUpdate(req.params.id, { is_active: 0 }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  } catch (err) {
    console.error("Error in deleteCategory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
