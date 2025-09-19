import Blog from "../models/Blog.js";
import slugify from "slugify";

// Create or Update Blog
export const saveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Generate slug
    const slug = slugify(data.slug || data.name, { lower: true });

    let blog;
    if (!id) {
      blog = new Blog({ ...data, slug, user_id: req.user?.id });
    } else {
      blog = await Blog.findByIdAndUpdate(
        id,
        { ...data, slug },
        { new: true }
      );
    }

    // Handle image upload
    if (req.file) {
      blog.image = req.file.filename;
    }

    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Change Status
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

// Delete Blog (Soft Delete)
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { is_active: 2 }, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Search Blogs
export const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    const condition = query
      ? { $and: [
          { is_active: { $ne: 2 } },
          { $or: [{ name: new RegExp(query, "i") }, { description: new RegExp(query, "i") }] }
        ] }
      : { is_active: { $ne: 2 } };

    const blogs = await Blog.find(condition).sort({ _id: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
