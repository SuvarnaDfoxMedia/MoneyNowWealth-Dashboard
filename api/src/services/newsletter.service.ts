import Newsletter from "../models/newsletter.model.ts";
import type { INewsletter } from "../models/newsletter.model.ts";
import mongoose from "mongoose";

/* ---------------------------------------------------
   CREATE NEWSLETTER
   - Ensure newsletter_code is generated
--------------------------------------------------- */
export const createNewsletter = async (data: {
  title: string;
  content: string;
  status?: "draft" | "published" | "archived";
}): Promise<INewsletter> => {
  // Trim inputs
  const title = data.title.trim();
  const content = data.content.trim();

  // Create newsletter instance
  const newsletter = new Newsletter({
    title,
    content,
    status: data.status || "draft",
  });

  // Save to trigger auto-increment plugin
  const savedNewsletter = await newsletter.save();

  // Ensure newsletter_code is set (post-save fallback)
  if (!savedNewsletter.newsletter_code && typeof savedNewsletter.newsletter_number === "number") {
    savedNewsletter.newsletter_code = "NL" + String(savedNewsletter.newsletter_number).padStart(3, "0");
    await savedNewsletter.save();
  }

  return savedNewsletter;
};

/* ---------------------------------------------------
   GET ALL NEWSLETTERS
--------------------------------------------------- */
export const getAllNewsletters = async (): Promise<INewsletter[]> => {
  return await Newsletter.find().sort({ created_at: -1 });
};

/* ---------------------------------------------------
   GET NEWSLETTER BY ID
--------------------------------------------------- */
export const getNewsletterById = async (id: string): Promise<INewsletter | null> => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Newsletter.findById(id);
};

/* ---------------------------------------------------
   UPDATE NEWSLETTER
--------------------------------------------------- */
export const updateNewsletter = async (
  id: string,
  data: Partial<Pick<INewsletter, "title" | "content" | "status">>
): Promise<INewsletter | null> => {
  if (!mongoose.isValidObjectId(id)) return null;

  const updateData: Partial<INewsletter> = {};

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.content !== undefined) updateData.content = data.content.trim();
  if (data.status !== undefined) updateData.status = data.status;

  return await Newsletter.findByIdAndUpdate(id, updateData, { new: true });
};

/* ---------------------------------------------------
   SOFT DELETE NEWSLETTER
--------------------------------------------------- */
export const softDeleteNewsletter = async (id: string): Promise<INewsletter | null> => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Newsletter.softDelete(id);
};
