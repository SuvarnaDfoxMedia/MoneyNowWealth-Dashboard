import express from "express";
import multer from "multer";
import path from "path";
import { body, validationResult } from "express-validator";
import { getProfile, updateProfile } from "../controllers/profileController.ts";
import type { AuthenticatedRequest } from "../controllers/profileController.ts";
import { protect } from "../middleware/authMiddleware.ts";
import fs from "fs";

const router = express.Router();

// Ensure uploads/profiles exists
const uploadDir = path.join(process.cwd(), "uploads/profiles");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Validation
const updateValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
  body("address").optional().isString().withMessage("Address must be a string"),
];

// Handle validation errors
const handleValidationErrors = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Routes
router.get("/", protect, (req: AuthenticatedRequest, res: express.Response) => getProfile(req, res));
router.put(
  "/",
  protect,
  upload.single("profileImage"),
  updateValidation,
  handleValidationErrors,
  (req: AuthenticatedRequest, res: express.Response) => updateProfile(req, res)
);

export default router;
