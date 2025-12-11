import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  saveCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} from "../controllers/blogCategoryController.js";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.js";

const router = express.Router();


const uploadDir = path.join(process.cwd(), "uploads", "category");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, "Cat_" + Date.now() + "_" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});



// GET all active categories
router.get("/categories", getCategories);

// Role middleware ensures only admin/editor can access
router.get(
  "/:role/blogcategory/:id",
  ...roleFromUrl(["admin", "editor"]),
  getCategoryById
);

// CREATE new category
router.post(
  "/:role/blogcategory/create",
  ...roleFromUrl(["admin", "editor"]),
  upload.single("image"),
  saveCategory
);

// UPDATE category by ID
router.put(
  "/:role/blogcategory/:id",
  ...roleFromUrl(["admin", "editor"]),
  upload.single("image"),
  saveCategory
);

// DELETE category (soft delete)
router.delete(
  "/:role/blogcategory/:id",
  ...roleFromUrl(["admin", "editor"]),
  deleteCategory
);

export default router;
