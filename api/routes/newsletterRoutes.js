import express from "express";
import { addNewsletter, getNewsletters, deleteNewsletter } from "../controllers/newsletterController.js";

const router = express.Router();

// Add newsletter
router.post("/newsletter", addNewsletter);

// Get all newsletters
router.get("/newsletters", getNewsletters);

// Soft delete newsletter
router.delete("/newsletter/:id", deleteNewsletter);

export default router;
