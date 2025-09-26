// routes/testRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Any logged-in user
router.get("/user", protect, (req, res) => {
  res.json({ message: "Hello user!", user: req.user });
});

// Only admin
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Hello admin!", user: req.user });
});

export default router;
