import Contact from "../models/Contact.js";

// Add contact
export const addContact = async (req, res) => {
  try {
    const { fullName, email, mobile, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const contact = new Contact({ fullName, email, mobile, subject, message, is_deleted: false });
    await contact.save();

    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all contacts (exclude soft-deleted)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ is_deleted: { $ne: true } }).sort({ _id: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Soft delete contact
export const softDeleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

