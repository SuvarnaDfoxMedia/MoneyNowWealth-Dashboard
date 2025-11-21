import express from "express";
import {
  addContactEnquiry,
  getContactEnquiries,
  softDeleteContactEnquiry,
} from "../controllers/contactEnquiryController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();

// ----------------------
// ----------------------
router.post("/contact-enquiries", addContactEnquiry); // Add a new enquiry

// ----------------------
// ----------------------
const adminMiddleware = roleFromUrl(["admin"]);

// ----------------------
// ----------------------
router.get("/contact-enquiries", getContactEnquiries); // List all enquiries

// Soft delete a user
router.delete("/:role/contact-enquiries/delete/:id", adminMiddleware, softDeleteContactEnquiry);

export default router;
