import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Article from "../models/articleModel.ts"; // import your Article model

const router = express.Router();

const sectionDir = path.join(process.cwd(), "uploads", "section");
if (!fs.existsSync(sectionDir)) {
  fs.mkdirSync(sectionDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, sectionDir),
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed!"));
  },
});

/* -------------------------------------------
--------------------------------------------*/
router.post("/upload-image", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/section/${req.file.filename}`;

    const { articleId, sectionIndex } = req.body; // pass these from frontend if known

    if (articleId && mongoose.Types.ObjectId.isValid(articleId)) {
      const article = await Article.findById(articleId);
      if (article) {
        // Ensure section exists
        if (article.sections && article.sections[sectionIndex]) {
          article.sections[sectionIndex].images =
            article.sections[sectionIndex].images || [];

          article.sections[sectionIndex].images.push({
            url: fileUrl,
            caption: req.file.filename,
          });

          await article.save();
        }
      }
    }

    return res.json({
      success: true,
      fileName: req.file.filename,
      url: fileUrl,
    });
  } catch (err: any) {
    console.error(" Upload failed:", err.message);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
