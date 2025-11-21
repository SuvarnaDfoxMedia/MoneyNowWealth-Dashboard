// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const router = express.Router();

// /* ============================================================
//    🗂️ Ensure Upload Folders Exist
// ============================================================ */
// const ensureDir = (dirPath: string) => {
//   if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
// };

// // Create folders if not present
// ensureDir(path.join(process.cwd(), "uploads", "article"));
// ensureDir(path.join(process.cwd(), "uploads", "cluster"));

// /* ============================================================
//    📰 ARTICLE IMAGE UPLOAD
// ============================================================ */
// const articleStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, "uploads/article"),
//   filename: (_req, file, cb) => {
//     const uniqueName = `article-body-${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const articleUpload = multer({
//   storage: articleStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"));
//   },
// });

// router.post("/upload-image", articleUpload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No file uploaded" });
//   }

//   const imageUrl = `http://localhost:5000/uploads/article/${req.file.filename}`;

//   res.json({
//     success: true,
//     url: imageUrl,
//     files: [imageUrl],
//     message: "Image uploaded successfully",
//   });
// });

// /* ============================================================
//    💎 CLUSTER THUMBNAIL UPLOAD
// ============================================================ */
// const clusterStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, "uploads/cluster"),
//   filename: (_req, file, cb) => {
//     const uniqueName = `cluster-thumb-${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const clusterUpload = multer({
//   storage: clusterStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"));
//   },
// });

// router.post(
//   "/upload-cluster-thumbnail",
//   clusterUpload.single("thumbnail"),
//   (req, res) => {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }

//     const imageUrl = `http://localhost:5000/uploads/cluster/${req.file.filename}`;

//     res.json({
//       success: true,
//       url: imageUrl,
//       files: [imageUrl],
//       message: "Cluster thumbnail uploaded successfully",
//     });
//   }
// );

// export default router;




import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ============================================================
   🗂️ Ensure Upload Folders Exist
============================================================ */
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// Create folders
ensureDir(path.join(process.cwd(), "uploads", "article"));
ensureDir(path.join(process.cwd(), "uploads", "thumbnail")); // ✅ now inside uploads/thumbnail

/* ============================================================
   📰 ARTICLE IMAGE UPLOAD
============================================================ */
const articleStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/article"),
  filename: (_req, file, cb) => {
    const uniqueName = `article-body-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const articleUpload = multer({
  storage: articleStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  },
});

router.post("/upload-image", articleUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const imageUrl = `http://localhost:5000/uploads/article/${req.file.filename}`;

  res.json({
    success: true,
    filename: req.file.filename, // save in DB
    url: imageUrl,               // show in frontend
    message: "Image uploaded successfully",
  });
});

/* ============================================================
   💎 CLUSTER THUMBNAIL UPLOAD
============================================================ */
const clusterStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/thumbnail"), // ✅ saved in uploads/thumbnail
  filename: (_req, file, cb) => {
    const uniqueName = `cluster-thumb-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const clusterUpload = multer({
  storage: clusterStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  },
});

router.post("/upload-cluster-thumbnail", clusterUpload.single("thumbnail"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const imageUrl = `http://localhost:5000/uploads/thumbnail/${req.file.filename}`;

  res.json({
    success: true,
    filename: req.file.filename, // ✅ store in DB
    url: imageUrl,               // ✅ for frontend preview
    message: "Cluster thumbnail uploaded successfully",
  });
});

export default router;
