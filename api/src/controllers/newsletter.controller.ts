import type { Request, Response } from "express";
import {
  createNewsletter,
  getAllNewsletters,
  getNewsletterById,
  updateNewsletter,
  softDeleteNewsletter,
} from "../services/newsletter.service.ts";

/* ---------------------------------------------------
   CREATE NEWSLETTER
--------------------------------------------------- */
export const createNewsletterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, status } = req.body;

    if (!title || !content || typeof title !== "string" || typeof content !== "string") {
      res.status(400).json({ message: "Title and content are required and must be strings" });
      return;
    }

    const newsletter = await createNewsletter({ title: title.trim(), content: content.trim(), status });

    if (!newsletter.newsletter_code) {
      console.warn("Warning: newsletter_code not generated for newsletter:", newsletter._id);
    }

    res.status(201).json({ message: "Newsletter created successfully", newsletter });
  } catch (error: any) {
    console.error("❌ CREATE Newsletter Error:", error.message, error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/* ---------------------------------------------------
   GET ALL NEWSLETTERS
--------------------------------------------------- */
export const getAllNewslettersController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const newsletters = await getAllNewsletters();
    res.status(200).json(newsletters);
  } catch (error: any) {
    console.error("❌ GET ALL Newsletters Error:", error.message, error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/* ---------------------------------------------------
   GET NEWSLETTER BY ID
--------------------------------------------------- */
export const getNewsletterByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const newsletter = await getNewsletterById(req.params.id);

    if (!newsletter) {
      res.status(404).json({ message: "Newsletter not found" });
      return;
    }

    res.status(200).json(newsletter);
  } catch (error: any) {
    console.error("❌ GET BY ID Newsletter Error:", error.message, error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/* ---------------------------------------------------
   UPDATE NEWSLETTER
--------------------------------------------------- */
export const updateNewsletterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const newsletter = await updateNewsletter(req.params.id, req.body);

    if (!newsletter) {
      res.status(404).json({ message: "Newsletter not found" });
      return;
    }

    res.status(200).json({ message: "Newsletter updated successfully", newsletter });
  } catch (error: any) {
    console.error("❌ UPDATE Newsletter Error:", error.message, error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/* ---------------------------------------------------
   SOFT DELETE NEWSLETTER
--------------------------------------------------- */
export const deleteNewsletterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const newsletter = await softDeleteNewsletter(req.params.id);

    if (!newsletter) {
      res.status(404).json({ message: "Newsletter not found" });
      return;
    }

    res.status(200).json({ message: "Newsletter deleted (soft)", newsletter });
  } catch (error: any) {
    console.error("❌ DELETE Newsletter Error:", error.message, error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
