
// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import {
//   saveBlog,
//   getBlogById,
//   changeStatus,
//   deleteBlog,
//   searchBlogs,
// } from "../controllers/blogController.js";
// import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

// const router = express.Router();

// const uploadDir = path.join("uploads", "blog");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) =>
//     cb(null, "Bi_" + Date.now() + "_" + file.originalname),
// });
// const upload = multer({ storage });

// router.get("/blog/:id", getBlogById);
// router.get("/blogs", searchBlogs);

// router.post(
//   "/blog",
//   protect,
//   authorizeRoles("admin", "editor"),
//   upload.single("image"),
//   saveBlog
// );

// router.put(
//   "/blog/:id",
//   protect,
//   authorizeRoles("admin", "editor"),
//   upload.single("image"),
//   saveBlog
// );

// router.put(
//   "/blog/status/:id",
//   protect,
//   authorizeRoles("admin", "editor"),
//   changeStatus
// );

// router.delete(
//   "/blog/:id",
//   protect,
//   authorizeRoles("admin", "editor"),
//   deleteBlog
// );

// export default router;



import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  saveBlog,
  getBlogById,
  changeStatus,
  deleteBlog,
  searchBlogs,
} from "../controllers/blogController.js";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.js";

const router = express.Router();

const uploadDir = path.join("uploads", "blog");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) =>
    cb(null, "Bi_" + Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });


router.get("/blog/:id", getBlogById);
router.get("/blogs", searchBlogs);


router.post(
  "/:role/blog/create",
  ...roleFromUrl(["admin", "editor"]),
  upload.single("image"),
  saveBlog
);

router.put(
  "/:role/blog/:id",
  ...roleFromUrl(["admin", "editor"]),
  upload.single("image"),
  saveBlog
);

router.put(
  "/:role/blog/status/:id",
  ...roleFromUrl(["admin", "editor"]),
  changeStatus
);

router.delete(
  "/:role/blog/:id",
  ...roleFromUrl(["admin", "editor"]),
  deleteBlog
);

export default router;
