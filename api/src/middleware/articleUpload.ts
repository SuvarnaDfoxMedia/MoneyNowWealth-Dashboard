// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import sharp from "sharp";
// import type { Request, Response, NextFunction } from "express";


// const ensureDir = (dirPath: string) => {
//   if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
// };



// /* -------------------- Directory -------------------- */
// const articleDir = path.join(process.cwd(), "uploads", "article");
// ensureDir(articleDir);

// /* -------------------- HERO IMAGE UPLOAD (1140x590) -------------------- */
// const heroStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, articleDir),
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `article-hero-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const heroUpload = multer({
//   storage: heroStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"));
//   },
// });

// export const uploadHeroImage = (req: Request, res: Response, next: NextFunction): void => {
//   const uploadSingle = heroUpload.single("hero_image");

//   uploadSingle(req, res, async (err: any) => {
//     if (err) return res.status(400).json({ success: false, message: err.message });
//     if (!req.file) return next();

//     try {
//       const metadata = await sharp(req.file.path).metadata();

//       if (metadata.width !== 1140 || metadata.height !== 590) {
//         fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
//         return res.status(400).json({
//           success: false,
//           message: "Hero image must be exactly 1140x590 pixels.",
//         });
//       }

//       const relativePath = `/uploads/article/${req.file.filename}`;
//       const publicUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

//       (req.file as any).relativePath = relativePath;
//       (req.file as any).pathUrl = publicUrl;

//       next();
//     } catch {
//       fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
//       res.status(400).json({ success: false, message: "Invalid image file." });
//     }
//   });
// };

// /* -------------------- ARTICLE BODY IMAGE UPLOAD (Any Size) -------------------- */
// const bodyStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, articleDir),
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `article-body-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const bodyUpload = multer({
//   storage: bodyStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"));
//   },
// });

// export const uploadArticleImage = (req: Request, res: Response, next: NextFunction): void => {
//   const uploadSingle = bodyUpload.single("image");

//   uploadSingle(req, res, (err: any) => {
//     if (err) return res.status(400).json({ success: false, message: err.message });
//     if (!req.file) return next();

//     const relativePath = `/uploads/article/${req.file.filename}`;
//     const publicUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

//     (req.file as any).relativePath = relativePath;
//     (req.file as any).pathUrl = publicUrl;

//     next();
//   });
// };



// /* -------------------- Directory -------------------- */
// const clusterDir = path.join(process.cwd(), "uploads", "cluster");
// ensureDir(clusterDir);

// /* -------------------- CLUSTER THUMBNAIL (Any Size or Min. Size Check) -------------------- */
// const clusterStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, clusterDir),
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `cluster-thumb-${uniqueSuffix}${path.extname(file.originalname)}`);
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

// export const uploadClusterThumbnail = (req: Request, res: Response, next: NextFunction): void => {
//   const uploadSingle = clusterUpload.single("thumbnail"); // field name: "thumbnail"

//   uploadSingle(req, res, async (err: any) => {
//     if (err) return res.status(400).json({ success: false, message: err.message });
//     if (!req.file) return next();

//     try {
//       const metadata = await sharp(req.file.path).metadata();

//       // Optional minimum resolution check
//       if ((metadata.width ?? 0) < 300 || (metadata.height ?? 0) < 200) {
//         fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
//         return res.status(400).json({
//           success: false,
//           message: "Thumbnail must be at least 300x200 pixels.",
//         });
//       }

//       const relativePath = `/uploads/cluster/${req.file.filename}`;
//       const publicUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

//       (req.file as any).relativePath = relativePath;
//       (req.file as any).pathUrl = publicUrl;

//       next();
//     } catch {
//       fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
//       res.status(400).json({ success: false, message: "Invalid image file." });
//     }
//   });
// };


import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import type { Request, Response, NextFunction } from "express";

/* ============================================================
   📁 Ensure folder exists
============================================================ */
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

/* ============================================================
   📰 HERO IMAGE UPLOAD (Keep as-is)
============================================================ */
const articleDir = path.join(process.cwd(), "uploads", "article");
ensureDir(articleDir);

const heroStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, articleDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `article-hero-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const heroUpload = multer({
  storage: heroStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  },
});

export const uploadHeroImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const uploadSingle = heroUpload.single("hero_image");

  uploadSingle(req, res, async (err: any) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return next();

    try {
      const metadata = await sharp(req.file.path).metadata();

      if (metadata.width !== 1140 || metadata.height !== 590) {
        fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Hero image must be exactly 1140x590 pixels.",
        });
      }

      const relativePath = `/uploads/article/${req.file.filename}`;
      const publicUrl = `${req.protocol}://${req.get("host")}${relativePath}`.replace(/\/{2,}/g, "/");

      (req.file as any).relativePath = relativePath;
      (req.file as any).pathUrl = publicUrl;

      next();
    } catch {
      fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
      res
        .status(400)
        .json({ success: false, message: "Invalid hero image file." });
    }
  });
};

/* ============================================================
   🖼️ BODY IMAGE UPLOAD (Section-based folders for Text Editor)
============================================================ */
const bodyStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const section = (req.body.section || "general").toLowerCase();
    const folder = path.join(process.cwd(), "uploads", "article", "body", section);
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `body-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const bodyUpload = multer({
  storage: bodyStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  },
});

export const uploadArticleImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle both Jodit v3 (file) and v4 (files[])
  const upload = bodyUpload.fields([{ name: "file" }, { name: "files[]" }]);

  upload(req, res, (err: any) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });

    const uploadedFiles = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
    const file = uploadedFiles["file"]?.[0] || uploadedFiles["files[]"]?.[0];

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded." });
    }

    const relativePath = file.path.replace(process.cwd(), "").replace(/\\/g, "/");
    const publicUrl = `${req.protocol}://${req.get("host")}${relativePath}`.replace(/\/{2,}/g, "/");

    (req as any).uploadedImage = { relativePath, publicUrl };

    if (req.originalUrl.includes("/upload-section-image")) {
      return res.status(200).json({
        success: true,
        url: publicUrl,
        relativePath,
      });
    }

    next();
  });
};
