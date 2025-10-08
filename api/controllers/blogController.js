import Blog from "../models/Blog.js";
import slugify from "slugify";

// Create or Update Blog
export const saveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Validation
    const errors = {};
    if (!data.name || data.name.trim() === "") errors.name = "Title is required";
    if (!data.slug || data.slug.trim() === "") errors.slug = "Slug is required";
    if (!data.description || data.description.trim() === "") errors.description = "Description is required";
    if (!data.date || data.date.trim() === "") errors.date = "Publish Date is required";
    if (!req.file && !id) errors.image = "Image is required"; // only required on create

    // Duplicate name check
    if (data.name && data.name.trim() !== "") {
      const existing = await Blog.findOne({ name: data.name.trim() });
      if (existing && (!id || existing._id.toString() !== id)) {
        errors.name = "Blog title already exists";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const slug = slugify(data.slug || data.name, { lower: true });
    let blog;

    if (!id) {
      // Create new blog
      blog = new Blog({
        name: data.name.trim(),
        slug,
        title_tag: data.title_tag || "",
        alt_tag: data.alt_tag || "",
        description: data.description,
        seo_title: data.seo_title || "",
        seo_meta_description: data.seo_meta_description || "",
        seo_keywords: data.seo_keywords || "",
        page_schema: data.page_schema || "",
        og_tags: data.og_tags || "",
        for_home: data.for_home || "No",
        publish_date: data.date,
        image: req.file?.filename || "",
        user_id: req.user?.id,
      });
    } else {
      // Update existing blog
      blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

      blog.name = data.name.trim();
      blog.slug = slug;
      blog.title_tag = data.title_tag || "";
      blog.alt_tag = data.alt_tag || "";
      blog.description = data.description;
      blog.seo_title = data.seo_title || "";
      blog.seo_meta_description = data.seo_meta_description || "";
      blog.seo_keywords = data.seo_keywords || "";
      blog.page_schema = data.page_schema || "";
      blog.og_tags = data.og_tags || "";
      blog.for_home = data.for_home || "No";
      blog.publish_date = data.date;

      if (req.file) blog.image = req.file.filename; // optional on update
    }

    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    // Handle Mongo duplicate key error (fallback)
    if (err.code === 11000 && err.keyPattern?.name) {
      return res.status(400).json({ success: false, errors: { name: "Blog title already exists" } });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List/Search blogs
export const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    const condition = query
      ? {
          $and: [
            { is_active: { $ne: 2 } },
            { $or: [{ name: new RegExp(query, "i") }, { description: new RegExp(query, "i") }] },
          ],
        }
      : { is_active: { $ne: 2 } };
    const blogs = await Blog.find(condition).sort({ _id: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Change status
export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const blog = await Blog.findByIdAndUpdate(id, { is_active: status }, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Soft delete
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { is_active: 2 }, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
