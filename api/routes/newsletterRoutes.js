import express from "express";
import { addNewsletter, getNewsletters, deleteNewsletter } from "../controllers/newsletterController.js";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.js";

const router = express.Router();

// Public route: anyone can subscribe
router.post("/newsletter", addNewsletter);

// Admin-only routes using role from URL
router.get(
  "/:role/newsletters",
  ...roleFromUrl(["admin"]),
  getNewsletters
);

router.delete(
  "/:role/newsletter/:id",
  ...roleFromUrl(["admin"]),
  deleteNewsletter
);

export default router;
