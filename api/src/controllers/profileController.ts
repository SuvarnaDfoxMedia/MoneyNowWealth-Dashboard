import express from "express";
import { validationResult } from "express-validator";
import User, { type IUser } from "../models/userModel.ts";

type Request = express.Request;
type Response = express.Response;

export type AuthenticatedRequest = Request & {
  user?: { id: string; role?: string };
  file?: Express.Multer.File;
};

// -------------------- GET PROFILE --------------------
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user: IUser | null = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: `${user.firstname} ${user.lastname}`.trim(),
      email: user.email,
      phone: user.phone || null,
      address: user.address || null,
      role: user.role,
      profileImage: user.profileImage ? `/uploads/profiles/${user.profileImage}` : null,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- UPDATE PROFILE --------------------
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, phone, address } = req.body;
    let firstname = "";
    let lastname = "";

    if (name) {
      const parts = name.trim().split(" ");
      firstname = parts.shift() || "";
      lastname = parts.join(" ") || "";
    }

    const updateData: Partial<IUser> = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (req.file?.filename) updateData.profileImage = req.file.filename;

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: `${updatedUser.firstname} ${updatedUser.lastname}`.trim(),
        email: updatedUser.email,
        phone: updatedUser.phone || null,
        address: updatedUser.address || null,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage
          ? `/uploads/profiles/${updatedUser.profileImage}`
          : null,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
