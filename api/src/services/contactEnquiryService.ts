import { ContactEnquiry } from "../models/contactEnquiryModel.ts";
import type { IContactEnquiry } from "../models/contactEnquiryModel.ts";

export const contactEnquiryService = {
  // Add a new enquiry
  add: async (data: Partial<IContactEnquiry>) => {
    const enquiry = new ContactEnquiry(data);
    return enquiry.save();
  },

  // Get all enquiries with search & pagination
  getAll: async ({
    search,
    page = 1,
    limit = 10,
  }: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const filter: any = { is_active: 1 };

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }, { subject: regex }];
    }

    const skip = (page - 1) * limit;
    const enquiries = await ContactEnquiry.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactEnquiry.countDocuments(filter);

    return { enquiries, total };
  },

  // Soft delete an enquiry
  softDelete: async (id: string) => {
    return ContactEnquiry.findByIdAndUpdate(
      id,
      { is_active: 0, updated_at: new Date() },
      { new: true }
    );
  },

  // Get enquiry by ID
  getById: async (id: string) => {
    return ContactEnquiry.findById(id);
  },

  // Update enquiry status
  updateStatus: async (id: string, status: "new" | "in-progress" | "resolved") => {
    return ContactEnquiry.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );
  },
};