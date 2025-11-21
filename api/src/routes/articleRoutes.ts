// // routes/articleRoutes.ts
// import express from "express";
// import {
//   getArticles,
//   getArticleById,
//   addArticle,
//   updateArticle,
//   deleteArticle,
//   toggleArticleStatus,
// } from "../controllers/articleController.ts";
// import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";
// import { uploadHeroImage } from "../middleware/articleUpload.ts"; // Added for image upload + validation

// const router = express.Router();

// /* -------------------- PUBLIC ROUTES -------------------- */
// router.get("/article", getArticles);

// router.get("/article/:id", getArticleById);

// /* -------------------- ADMIN / EDITOR ROUTES -------------------- */
// const adminEditorMiddleware = roleFromUrl(["admin", "editor"]);

// router.post(
//   "/:role/article/create",
//   adminEditorMiddleware,
//   uploadHeroImage, // handles hero image upload (checks 1440×590)
//   addArticle
// );

// router.put(
//   "/:role/article/edit/:id",
//   adminEditorMiddleware,
//   uploadHeroImage, // allows new hero image replacement (same dimension rules)
//   updateArticle
// );

// router.patch(
//   "/:role/article/change/:id/status",
//   adminEditorMiddleware,
//   toggleArticleStatus
// );

// router.delete(
//   "/:role/article/delete/:id",
//   adminEditorMiddleware,
//   deleteArticle
// );

// export default router;


import express from "express";
import {
  getArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
} from "../controllers/articleController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";
import { uploadHeroImage, uploadArticleImage } from "../middleware/articleUpload.ts";

const router = express.Router();

/* -------------------- PUBLIC ROUTES -------------------- */
router.get("/article", getArticles);
router.get("/article/:id", getArticleById);

/* -------------------- ADMIN / EDITOR ROUTES -------------------- */
const adminEditorMiddleware = roleFromUrl(["admin", "editor"]);

router.post(
  "/:role/article/create",
  adminEditorMiddleware,
  uploadHeroImage,
  addArticle
);

// ✅ Edit article
router.put(
  "/:role/article/edit/:id",
  adminEditorMiddleware,
  uploadHeroImage,
  updateArticle
);

// ✅ Toggle article active/inactive
router.patch(
  "/:role/article/change/:id/status",
  adminEditorMiddleware,
  toggleArticleStatus
);

// ✅ Delete article
router.delete(
  "/:role/article/delete/:id",
  adminEditorMiddleware,
  deleteArticle
);

/* -------------------- SECTION IMAGE UPLOAD (used by RichTextField) -------------------- */
router.post(
  "/:role/article/upload-section-image",
  adminEditorMiddleware,
  uploadArticleImage,
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded." });
    }

    return res.status(200).json({
      success: true,
      url: (req.file as any).pathUrl,
      relativePath: (req.file as any).relativePath,
    });
  }
);

export default router;
