import Blog from "../models/Blog.js";
import slugify from "slugify";

// Create or Update Blog
export const saveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Validate required fields
    if (!data.name || !data.slug || (!req.file && !id)) {
      const errors = {};
      if (!data.name) errors.name = "Title is required";
      if (!data.slug) errors.slug = "Slug is required";
      if (!req.file && !id) errors.image = "Image is required"; // only required for create
      return res.status(400).json({ success: false, errors });
    }

    const slug = slugify(data.slug || data.name, { lower: true });
    let blog;

    if (!id) {
      // Create
      blog = new Blog({
        ...data,
        slug,
        user_id: req.user?.id,
        for_home: data.for_home || "No",
        publish_date: data.date || new Date(),
        image: req.file?.filename || "",
      });
    } else {
      // Update
      blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

      blog.name = data.name;
      blog.slug = slug;
      blog.title_tag = data.title_tag || "";
      blog.alt_tag = data.alt_tag || "";
      blog.description = data.description || "";
      blog.seo_title = data.seo_title || "";
      blog.seo_meta_description = data.seo_meta_description || "";
      blog.seo_keywords = data.seo_keywords || "";
      blog.page_schema = data.page_schema || "";
      blog.og_tags = data.og_tags || "";
      blog.for_home = data.for_home || "No";
      blog.publish_date = data.date || new Date();

      if (req.file) blog.image = req.file.filename; // optional image update
    }

    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
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
