import express from "express";
import { addContact, getContacts, softDeleteContact } from "../controllers/contactController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/contact", addContact);

// Admin-only routes
router.get("/contacts", protect, authorizeRoles("admin"), getContacts);
router.delete("/contact/:id", protect, authorizeRoles("admin"), softDeleteContact);

export default router;
