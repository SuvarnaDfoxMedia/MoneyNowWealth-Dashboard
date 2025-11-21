import type { Request, Response } from "express";
import { contactEnquiryService } from "../services/contactEnquiryService.ts";

// -------------------- PUBLIC --------------------
// Add a new contact enquiry
export const addContactEnquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !email || !mobile || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const enquiry = await contactEnquiryService.add({ name, email, mobile, subject, message });
    res.status(201).json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Add contact enquiry error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ADMIN ONLY --------------------
// Get all contact enquiries with search + pagination
export const getContactEnquiries = async (req: Request, res: Response) => {
  try {
    const { search, page = "1", limit = "10" } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { enquiries, total } = await contactEnquiryService.getAll({
      search: typeof search === "string" ? search : undefined,
      page: pageNum,
      limit: limitNum,
    });

    res.json({
      success: true,
      enquiries,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    console.error("Get contact enquiries error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ADMIN ONLY --------------------
// Soft delete a contact enquiry
export const softDeleteContactEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enquiry = await contactEnquiryService.softDelete(id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Contact enquiry not found" });
    }

    res.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Soft delete contact enquiry error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ADMIN ONLY --------------------
// Update enquiry status
export const updateContactEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const enquiry = await contactEnquiryService.updateStatus(id, status as any);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Contact enquiry not found" });
    }

    res.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Update contact enquiry status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
