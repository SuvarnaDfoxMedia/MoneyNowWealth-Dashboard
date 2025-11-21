import express from "express";
import type { Request, Response } from "express"; // <-- only types
import { protect, authorizeRoles } from "../middleware/authMiddleware.ts";

const router = express.Router();

// Any logged-in user
router.get("/user", protect, (req: Request, res: Response) => {
  res.json({ message: "Hello user!", user: (req as any).user });
});

// Only admin
router.get("/admin", protect, authorizeRoles("admin"), (req: Request, res: Response) => {
  res.json({ message: "Hello admin!", user: (req as any).user });
});

export default router;
