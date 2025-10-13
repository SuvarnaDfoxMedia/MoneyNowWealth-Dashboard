import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    //new
    profileImage: { type: String }, // NEW: Store image filename
    phone: { type: String }, // NEW: Phone number
    address: { type: String }, // NEW: Address
    role: {
      type: String,
      enum: ["user", "editor", "admin"],
      default: "user",
    },
    role: {
      type: String,
      enum: ["user", "editor", "admin"],
      default: "user",
    },
    //-------
    isTermsAccepted: { type: Boolean, default: false }, // <-- NEW FIELD
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

export default User;  