// import multer from "multer";
// import path from "path";
// import fs from "fs";

// /* -----------------------------
//    Thumbnail Upload Directory Setup
// ------------------------------ */
// const thumbnailDir = path.join(process.cwd(), "uploads", "thumbnail");
// if (!fs.existsSync(thumbnailDir)) {
//   fs.mkdirSync(thumbnailDir, { recursive: true });
// }

// /* -----------------------------
//    Common File Filter
// ------------------------------ */
// const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// /* -----------------------------
//    Cluster Thumbnail Storage
// ------------------------------ */
// const thumbnailStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, thumbnailDir),
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "cluster-thumb-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// export const uploadClusterThumbnail = multer({
//   storage: thumbnailStorage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// }).single("thumbnail");


// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// /* -----------------------------
//    Setup for ES Modules (__dirname replacement)
// ------------------------------ */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* -----------------------------
//    Thumbnail Upload Directory Setup
// ------------------------------ */
// const thumbnailDir = path.join(process.cwd(), "uploads", "thumbnail");
// if (!fs.existsSync(thumbnailDir)) {
//   fs.mkdirSync(thumbnailDir, { recursive: true });
// }

// /* -----------------------------
//    Common File Filter
// ------------------------------ */
// const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// /* -----------------------------
//    Cluster Thumbnail Storage
// ------------------------------ */
// const thumbnailStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, thumbnailDir),
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `cluster-thumb-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// /* -----------------------------
//    Export Middleware
// ------------------------------ */
// export const uploadClusterThumbnail = multer({
//   storage: thumbnailStorage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
// }).single("thumbnail");


import multer from "multer";
import path from "path";
import fs from "fs";

/* -----------------------------
   Thumbnail Upload Directory
------------------------------ */
const thumbnailDir = path.join(process.cwd(), "uploads", "thumbnail");

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

/* -----------------------------
   File Filter (Images Only)
------------------------------ */
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

/* -----------------------------
   Storage Engine
------------------------------ */
const thumbnailStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, thumbnailDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `cluster-thumb-${unique}${ext}`);
  },
});

/* -----------------------------
   Export Middleware
------------------------------ */
export const uploadClusterThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("thumbnail");
