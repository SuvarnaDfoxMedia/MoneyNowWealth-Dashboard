import express from "express";
import { addContact, getContacts, softDeleteContact } from "../controllers/contactController.js";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.js";

const router = express.Router();

// Public route: anyone can submit contact enquiry
router.post("/contact", addContact);

// Role-protected routes (admin, editor, etc.)
router.get("/:role/contacts", ...roleFromUrl(["admin"]), getContacts);

router.delete("/:role/contact/:id", ...roleFromUrl(["admin"]), softDeleteContact);

export default router;
