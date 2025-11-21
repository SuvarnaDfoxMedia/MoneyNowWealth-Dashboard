import express from "express";
import type { Request, Response } from "express";
import {getAllUsers, softDeleteUser, registerUser, loginUser, logoutUser, forgotPassword, resetPassword, changePassword } from "../controllers/authController.ts";

import { validateRegister } from "../middleware/validateRequest.ts";
import { protect, authorizeRoles } from "../middleware/authMiddleware.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();

const adminMiddleware = roleFromUrl(["admin"]);

// Auth routes
router.post("/register", validateRegister, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", getAllUsers);

router.delete("/:role/users/delete/:id", adminMiddleware, softDeleteUser);



// Change password
router.post("/change-password", protect, changePassword);
// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password (token in URL)
router.post("/reset-password/:token", resetPassword);

// Test route for user profile via auth
router.get("/profile", protect, (req: Request, res: Response) => {
  res.json({ message: "Profile data", user: req.user });
});

// Role-based access examples
router.get("/admin", protect, authorizeRoles("admin"), (req: Request, res: Response) => {
  res.json({ message: "Admin dashboard", user: req.user });
});

router.get("/editor", protect, authorizeRoles("editor"), (req: Request, res: Response) => {
  res.json({ message: "Editor panel", user: req.user });
});

export default router;
