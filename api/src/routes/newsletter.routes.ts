import express from "express";
import {
  createNewsletterController,
  getAllNewslettersController,
  getNewsletterByIdController,
  updateNewsletterController,
  deleteNewsletterController,
} from "../controllers/newsletter.controller.ts";

const router = express.Router();

router.post("/", createNewsletterController);
router.get("/", getAllNewslettersController);
router.get("/:id", getNewsletterByIdController);
router.put("/:id", updateNewsletterController);
router.delete("/:id", deleteNewsletterController);

export default router;
