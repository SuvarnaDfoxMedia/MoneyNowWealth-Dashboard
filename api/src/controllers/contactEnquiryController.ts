import type { Request, Response } from "express";
import { contactEnquiryService } from "../services/contactEnquiryService";

// -------------------- PUBLIC --------------------
// Add a new contact enquiry
export const addContactEnquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !email || !mobile || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const enquiry = await contactEnquiryService.add({
      name,
      email,
      mobile,
      subject,
      message,
    });

    return res.status(201).json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Add contact enquiry error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contact enquiries with search, pagination, and sort
export const getContactEnquiries = async (req: Request, res: Response) => {
  try {
    // Explicitly cast query params to string
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const pageStr = typeof req.query.page === "string" ? req.query.page : "1";
    const limitStr = typeof req.query.limit === "string" ? req.query.limit : "10";
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "created_at";
    const sortOrder = typeof req.query.sortOrder === "string" ? req.query.sortOrder : "desc";

    // Convert to numbers safely
    const pageNum = Math.max(parseInt(pageStr, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limitStr, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: Record<string, any> = {};
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { mobile: regex },
        { subject: regex },
      ];
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortField] = sortOrder.toLowerCase() === "asc" ? 1 : -1;

    // Fetch data
    const { enquiries, total } = await contactEnquiryService.getAll({
      filter,
      skip,
      limit: limitNum,
      sort,
    });

    return res.json({
      success: true,
      enquiries,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(Math.ceil(total / limitNum), 1),
    });
  } catch (error: any) {
    console.error("Get contact enquiries error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ADMIN ONLY --------------------
// Soft delete a contact enquiry
export const softDeleteContactEnquiry = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const enquiry = await contactEnquiryService.softDelete(id);

    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Contact enquiry not found" });
    }

    return res.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Soft delete contact enquiry error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ADMIN ONLY --------------------
// Update enquiry status
export const updateContactEnquiryStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "in-progress", "resolved"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const enquiry = await contactEnquiryService.updateStatus(
      id,
      status as any
    );

    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Contact enquiry not found" });
    }

    return res.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Update contact enquiry status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
