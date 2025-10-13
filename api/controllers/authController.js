import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/emails.js"; 
dotenv.config();

// Register
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, termsAccepted } = req.body;

    // validation
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "user", 
      isTermsAccepted: termsAccepted, 
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          role: newUser.role,
        },
      });

 
  await sendEmail(newUser.email, "Welcome to MoneyNow Wealth!", null, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to MoneyNow Wealth</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #eef2f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        border: 1px solid #d1d5db; /* subtle border around container */
      }
      .header {
        background: linear-gradient(135deg, #140084, #5e00ff);
        color: #fff;
        text-align: center;
        padding: 30px 20px;
        border-bottom: 4px solid #fff; /* subtle separation border */
      }
      .header img {
        width: 120px;
        cursor: pointer;
        margin-bottom: 15px;
        border: 2px solid #ffffff; /* adds a crisp border around logo */
        border-radius: 8px;
        padding: 4px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }
      .content {
        padding: 30px 25px;
        color: #333333;
        line-height: 1.7;
        font-size: 16px;
        border-top: 1px solid #e0e4e8; /* separates header from content */
      }
      .content p {
        margin: 15px 0;
      }
      .btn {
        display: inline-block;
        margin: 25px auto 0 auto;
        padding: 14px 28px;
        background: #140084;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        transition: all 0.3s ease;
        border: 2px solid #140084; /* adds border for better visual */
      }
      .btn:hover {
        background: #5e00ff;
        border-color: #5e00ff;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #999999;
        padding: 20px;
        background: #f9fafb;
        border-top: 1px solid #d1d5db; /* separates content from footer */
      }
      @media screen and (max-width: 480px) {
        .container {
          margin: 20px 10px;
        }
        .header h1 {
          font-size: 24px;
        }
        .content {
          padding: 20px 15px;
          font-size: 15px;
        }
        .btn {
          padding: 10px 20px;
          font-size: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
      
        <h1>Welcome to MoneyNow Wealth</h1>
      </div>
      <div class="content">
        <p>Hi <b>${newUser.firstname}</b>,</p>
        <p>Thank you for joining <b>MoneyNow Wealth</b>! Your account has been created successfully.</p>
        <p>Click the button below to sign in and start exploring:</p>
        <div style="text-align: center;">
          <a href="https://moneynowwealth.com/signin" class="btn">Sign In</a>
        </div>
        <p style="margin-top:20px;">If you did not register for this account, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} MoneyNow Wealth. All rights reserved.
      </div>
    </div>
  </body>
</html>
`);


    //// if Admin want ton receive email on new user registration
    // sendEmail(
    //   process.env.ADMIN_EMAIL,
    //   "New User Registered",
    //   `New user registered:\nName: ${newUser.firstname} ${newUser.lastname}\nEmail: ${newUser.email}`
    // ).catch((err) => console.error("Admin email error:", err.message));

  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};



// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    // Set cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
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
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const logoutUser = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      expires: new Date(0), 
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Create reset token (valid 15 min)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "15m" });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 3. Respond immediately to frontend
    res.json({ message: "Password reset link sent to your email" });

    // 4. Send email asynchronously (non-blocking)
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;">
        <div style="text-align:center;">
          <a href="${process.env.FRONTEND_URL}">
            <img src="${process.env.FRONTEND_URL}/images/logo/moneynowwealth-icon.png" alt="MoneyNow Wealth" width="120"/>
          </a>
          <h2 style="color:#333;">Forgot Your Password?</h2>
        </div>
        <p>Hi ${user.firstname || "User"},</p>
        <p>We received a request to reset your password. Click below to set a new password:</p>
        <div style="text-align:center;margin:20px;">
          <a href="${resetUrl}" style="background:#140084;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px;">Reset Password</a>
        </div>
        <p style="font-size:14px;color:#666;">This link expires in 15 minutes. If you didn’t request this, ignore this email.</p>
        <p>— MoneyNow Wealth Team</p>
      </div>
    `;
    sendEmail(user.email, "Reset Your Password",null , html)
      .catch(err => console.error("Email error:", err.message));

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, password } = req.body;

    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) return res.status(400).json({ message: "Invalid or expired token" });

    // 2. Find user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Check email matches token's user
    if (user.email !== email) {
      return res.status(400).json({ message: "Email does not match token user" });
    }

    // 4. Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    // At least 1 uppercase, 1 number, 1 symbol, min 8 chars
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character."
      });
    }

    // 5. Hash new password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Optional: Validate new password strength here (like resetPassword)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.",
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
