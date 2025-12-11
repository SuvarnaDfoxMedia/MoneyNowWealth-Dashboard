// controllers/newsletterController.js
import Newsletter from "../models/Newsletter.js";

// Add newsletter
export const addNewsletter = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const newsletter = new Newsletter({ name, email, is_deleted: false });
    await newsletter.save();

    res.json({ success: true, newsletter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all newsletters (exclude soft-deleted)
export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find({ is_deleted: { $ne: true } }).sort({ _id: -1 });
    res.json({ success: true, newsletters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Soft delete newsletter
export const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!newsletter) return res.status(404).json({ success: false, message: "Newsletter not found" });

    res.json({ success: true, message: "Newsletter deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
