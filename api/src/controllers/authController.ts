import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import { Types } from "mongoose";

import User from "../models/userModel.ts";
import UserSubscription from "../models/userSubscriptionModel.ts";
import SubscriptionPlanModel from "../models/subscriptionPlan.model.ts";
import UserSubscriptionPayment from "../models/userSubscriptionPaymentModel.ts";
import { sendEmail } from "../utils/emails.ts";

dotenv.config();

const JWT_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateToken = (userId: string, role: string) =>
  jwt.sign({ id: userId, role }, process.env.JWT_KEY!, { expiresIn: "7d" });

// ---------------------- Helpers ----------------------
const addDurationToDate = (date: Date, value: number, unit: "day" | "month" | "year") => {
  const result = new Date(date);
  switch (unit) {
    case "day":
      result.setDate(result.getDate() + value);
      break;
    case "month":
      result.setMonth(result.getMonth() + value);
      break;
    case "year":
      result.setFullYear(result.getFullYear() + value);
      break;
    default:
      throw new Error(`Unsupported duration unit: ${unit}`);
  }
  return result;
};

// ---------------------- Create or Update Subscription ----------------------
export const createOrUpdateSubscription = async (
  userId: string,
  planDoc: any,
  opts?: {
    planType?: "Free" | "Premium";
    trialType?: "free_sample" | "premium_sample";
    amount?: number;
    currency?: string;
    note?: string;
  }
) => {
  const now = new Date();
  if (!planDoc.duration || !planDoc.duration.value || !planDoc.duration.unit) {
    throw new Error("Plan duration is missing or invalid");
  }
  const durationUnit = planDoc.duration.unit as "day" | "month" | "year";
  const endDate = addDurationToDate(now, planDoc.duration.value, durationUnit);

  const amount = opts?.amount ?? planDoc.price ?? 0;
  const currency = opts?.currency || planDoc.currency || "INR";
  const planType = opts?.planType || planDoc.name;
  const trialType =
    opts?.trialType || (planType === "Free" ? "free_sample" : "premium_sample");

  // Check for existing subscription
  const existing = await UserSubscription.findOne({
    user_id: userId,
    is_deleted: false,
  }).sort({ created_at: -1 });

  let subscription;
  if (existing) {
    existing.plan_id = planDoc._id;
    existing.plan_type = planType;
    existing.trial_type = trialType;
    existing.start_date = now;
    existing.end_date = endDate;
    existing.status = planType === "Premium" ? "upgrade" : "new";
    existing.auto_renew = false;
    existing.last_payment_id = null;
    existing.is_active = true;
    subscription = await existing.save();
  } else {
    subscription = await UserSubscription.create({
      user_id: new Types.ObjectId(userId),
      plan_id: planDoc._id,
      plan_type: planType,
      trial_type: trialType,
      start_date: now,
      end_date: endDate,
      status: planType === "Premium" ? "upgrade" : "new",
      auto_renew: false,
      is_deleted: false,
      is_active: true,
    });
  }

  // ---------------------- Create Payment Record ----------------------
  await UserSubscriptionPayment.createPaymentForSubscription({
    user_id: subscription.user_id,
    user_subscription_id: subscription._id,
    plan_id: planDoc._id,
    amount,
    currency,
    payment_method: planType === "Free" ? "free_plan" : "online",
    transaction_id: `TXN-${subscription._id}-${Date.now()}`, // dummy transaction
    order_id: `ORD-${subscription._id}-${Date.now()}`, // dummy order
    payment_status: "success",
    type: planType === "Free" ? "new" : "payment",
    payment_date: new Date(),
    metadata: { note: opts?.note || `Subscription created: ${planType}` },
  });

  return subscription;
};

// ---------------------- Assign Free Plan ----------------------
export const assignFreePlan = async (userId: string) => {
  const freePlan = await SubscriptionPlanModel.findOne({
    name: "Free",
    is_active: true,
    is_deleted: false,
  }).lean();

  if (!freePlan) throw new Error("Free Plan not found");

  return createOrUpdateSubscription(userId, freePlan, {
    planType: "Free",
    trialType: "free_sample",
  });
};

// ---------------------- REGISTER USER ----------------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    let { firstname, lastname, email, password, mobile, termsAccepted } = req.body;

    // ---------------- Validation ----------------
    if (!firstname || !lastname || !email || !password || !mobile)
      return res.status(400).json({ message: "All fields are required" });

    if (termsAccepted !== true)
      return res.status(400).json({ message: "You must accept the terms and conditions" });

    email = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,128}$/.test(password))
      return res.status(400).json({
        message: "Password must be 8-128 chars, include 1 uppercase, 1 number, and 1 special character",
      });

    // ---------------- Check unique email ----------------
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // ---------------- Hash password ----------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------- Create User ----------------
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile, // duplicate mobile allowed
      password: hashedPassword,
      role: "user",
      isTermsAccepted: termsAccepted,
    });

    // ---------------- Assign Free Plan ----------------
    let subscription;
    try {
      subscription = await assignFreePlan(newUser._id);
    } catch (err: any) {
      console.error("Free Plan assignment failed:", err.message || err);
      return res.status(500).json({ message: "Free plan assignment failed", error: err.message });
    }

    // ---------------- Generate JWT ----------------
    const token = generateToken(newUser._id.toString(), newUser.role);

    // ---------------- Send Welcome Email ----------------
    const html = `
      <div style="font-family: sans-serif; max-width:600px; margin:auto; padding:30px; border-radius:12px; background:#f7f9fc;">
        <div style="text-align:center;">
          <h1 style="color:#140084; font-size:28px;">Welcome, ${newUser.firstname}!</h1>
          <p style="color:#555;">Your account has been successfully created.</p>
          <a href="${process.env.FRONTEND_URL}/signin" style="display:inline-block; background:#140084;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;margin-top:20px;">Sign In</a>
        </div>
        <p style="color:#777; text-align:center; margin-top:20px;">If you did not register, please ignore this email.</p>
        <p style="color:#999; text-align:center; margin-top:20px;">— Team</p>
      </div>
    `;
    import("../utils/emails.ts").then(({ sendEmail }) => {
      sendEmail({ to: newUser.email, subject: "Welcome!", html }).catch(err =>
        console.error("Email error:", err?.message || err)
      );
    });

    // ---------------- Response ----------------
    res
      .cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: JWT_EXPIRES })
      .status(201)
      .json({
        message: "User registered successfully. Free Plan assigned.",
        user: {
          id: newUser._id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          mobile: newUser.mobile,
          role: newUser.role,
        },
        subscription,
        token,
      });
  } catch (error: any) {
    console.error("Registration error:", error?.message || error);
    res.status(500).json({ message: "Server error during registration" });
  }
};



export const loginUser = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    email = email.trim().toLowerCase();

    // Include password explicitly
    const user: IUser | null = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString(), user.role);

    res
      .cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: JWT_EXPIRES })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGOUT =================
export const logoutUser = (req: Request, res: Response) => {
  res.cookie("token", "", { httpOnly: true, secure: false, sameSite: "lax", expires: new Date(0) })
     .status(200).json({ message: "Logged out successfully" });
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user: IUser | null = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Unique token for each user, expires in 10 minutes
    const resetToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY!, { expiresIn: "10m" });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    res.json({ message: "Password reset link sent to your email" });

   const html = `
  <div style="font-family:sans-serif; max-width:600px; margin:auto; padding:30px; border-radius:12px; background:#f7f9fc; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <h2 style="color:#140084;">Hi ${user.firstname || "User"},</h2>
    <p>We received a request to reset your password. Click the link below to set a new password. This link expires in 10 minutes:</p>
    <p style="word-break: break-all; font-size:16px; line-height:1.5;">
      <a href="${resetUrl}" style="color:#140084; text-decoration:underline;">${resetUrl}</a>
    </p>
    <p style="font-size:14px;color:#777;">If you did not request a password reset, please ignore this email.</p>
    <p style="font-size:14px;color:#999;margin-top:20px;">— MoneyNow Wealth Team</p>
  </div>
`;

    sendEmail({ to: user.email, subject: "Reset Your Password", html }).catch(err =>
      console.error("Email error:", err.message)
    );
  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY!) as { id: string };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ success: false, message: "Reset link has expired. Please request a new one." });
      }
      return res.status(400).json({ success: false, message: "Invalid reset token." });
    }

    const user: IUser | null = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,128}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        success: false,
        message: "Password must be 8-128 chars, include 1 uppercase, 1 number, and 1 special character.",
      });

    user.password = await bcrypt.hash(password, 10);

    // Optional: invalidate token if stored in DB
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully.",
      redirectUrl: `${process.env.FRONTEND_URL}/signin?reset=success`,
    });
  } catch (error: any) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


// ================= CHANGE PASSWORD =================
export const changePassword = async (req: any, res: Response) => {
  try {
    const userId: string = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Old and new password are required" });

    const user: IUser | null = await User.findById(userId);
    if (!user || !user.password) return res.status(404).json({ message: "User not found or password missing" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword))
      return res.status(400).json({
        message: "New password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character.",
      });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = String(req.query.search || "").trim();
    const sortField = String(req.query.sortField || "created_at");
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    // Base query: only users with role "user" and not soft deleted
    const searchQuery: any = { role: "user", is_deleted: false };

    // Add search filter if search text is provided
    if (search) {
      searchQuery.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(searchQuery);

    const users = await User.find(searchQuery, "-password -resetPasswordToken -resetPasswordExpires")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      users,
    });
  } catch (error: any) {
    console.error("Get users error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while fetching users" });
  }
};

// SOFT DELETE USER
export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete: set is_deleted = true
    const user = await User.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Soft delete user error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
