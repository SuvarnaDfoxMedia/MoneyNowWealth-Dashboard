import express from "express";
import { registerUser, loginUser , logoutUser, forgotPassword, resetPassword, changePassword} from "../controllers/authController.js";
import { validateRegister } from "../middleware/validateRequest.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

//  Public routes
router.post("/register", validateRegister, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/change-password", protect, changePassword);

 //Example protected routes()
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin dashboard", user: req.user });
});

router.get("/editor", protect, authorizeRoles("editor", "admin"), (req, res) => {
  res.json({ message: "Editor area", user: req.user });
});

// Forgot Password Request
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);



export default router;
