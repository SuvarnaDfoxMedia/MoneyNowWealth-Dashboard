import express from "express";
import multer from "multer";
import {
  saveBlog,
  changeStatus,
  deleteBlog,
  searchBlogs,
} from "../controllers/blogController.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: "api/uploads/blog/",
  filename: (req, file, cb) => {
    cb(null, "Bi_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/blog", upload.single("image"), saveBlog);          // Create
router.put("/blog/:id", upload.single("image"), saveBlog);       // Update
router.put("/blog/status/:id", changeStatus);                   // Change Status
router.delete("/blog/:id", deleteBlog);                         // Soft Delete
router.get("/blogs", searchBlogs);                              // Search/List

export default router;
