import { ContactEnquiry } from "../models/contactEnquiryModel";
import type { IContactEnquiry } from "../models/contactEnquiryModel";
import type { SortOrder } from "mongoose";

interface GetAllParams {
filter?: Record<string, any>;
skip?: number;
limit?: number;
sort?: Record<string, SortOrder>; // Use Mongoose's SortOrder type
}

export const contactEnquiryService = {
// ========================= ADD A NEW ENQUIRY =========================
add: async (data: Partial<IContactEnquiry>) => {
const enquiry = new ContactEnquiry(data);
return enquiry.save();
},

// ========================= GET ALL ENQUIRIES WITH PAGINATION =========================
getAll: async ({
filter = {},
skip = 0,
limit = 10,
sort = { created_at: -1 } as Record<string, SortOrder>, // default sort
}: GetAllParams) => {
const defaultFilter = { is_active: 1, ...filter };
const enquiries = await ContactEnquiry.find(defaultFilter)
.sort(sort)
.skip(skip)
.limit(limit);
const total = await ContactEnquiry.countDocuments(defaultFilter);
return { enquiries, total };
},

// ========================= SOFT DELETE =========================
softDelete: async (id: string) => {
return ContactEnquiry.findByIdAndUpdate(
id,
{ is_active: 0, updated_at: new Date() },
{ new: true }
);
},

// ========================= GET ENQUIRY BY ID =========================
getById: async (id: string) => {
return ContactEnquiry.findById(id);
},

// ========================= UPDATE ENQUIRY STATUS =========================
updateStatus: async (
id: string,
status: "new" | "in-progress" | "resolved"
) => {
return ContactEnquiry.findByIdAndUpdate(
id,
{ status, updated_at: new Date() },
{ new: true }
);
},
};
