
// import mongoose, { Document, Schema, Model } from "mongoose";

// export type IUser = Document & {
//   firstname: string;
//   lastname: string;
//   email: string;
//   password?: string;
//   role: "user" | "editor" | "admin";
//   isTermsAccepted: boolean;
//   profileImage?: string;
//   phone?: string;
//   address?: string;
//   is_deleted?: boolean;
//   is_active?: boolean;
//   created_at: Date;
//   updated_at: Date;
// };

// const userSchema: Schema<IUser> = new mongoose.Schema(
//   {
//     firstname: { type: String, required: true, trim: true },
//     lastname: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, select: false },
//     role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
//     isTermsAccepted: { type: Boolean, default: false },
//     profileImage: { type: String, default: null },
//     phone: { type: String, default: null, trim: true },
//     address: { type: String, default: null, trim: true },
//     is_deleted: { type: Boolean, default: false },
//     is_active: { type: Boolean, default: true },
//   },
//   {
//     timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
//     versionKey: false,
//   }
// );

// // Virtual for full name
// userSchema.virtual("fullName").get(function () {
//   return `${this.firstname} ${this.lastname}`;
// });

// const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

// export default User;



// import mongoose, { Document, Schema, Model } from "mongoose";

// export type IUser = Document & {
//   firstname: string;
//   lastname: string;
//   email: string;
//   password?: string;
//   mobile: string;
//   role: "user" | "editor" | "admin";
//   isTermsAccepted: boolean;
//   is_deleted: boolean;       // Soft delete flag
//   created_at: Date;
//   updated_at: Date;
// };

// const userSchema: Schema<IUser> = new Schema(
//   {
//     firstname: { type: String, required: true },
//     lastname: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, select: false },
//     mobile: { type: String, required: true, unique: true },
//     role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
//     isTermsAccepted: { type: Boolean, required: true }, // Mandatory now
//     is_deleted: { type: Boolean, default: false }, // Soft delete
//   },
//   { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
// );

// const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
// export default User;




import mongoose, { Document, Schema, Model } from "mongoose";

export type IUser = Document & {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  mobile: string;
  role: "user" | "editor" | "admin";
  isTermsAccepted: boolean;
  is_deleted: boolean;       // Soft delete flag
  created_at: Date;
  updated_at: Date;
};

const userSchema: Schema<IUser> = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    mobile: { type: String, required: true }, // removed unique: true
    role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
    isTermsAccepted: { type: Boolean, required: true },
    is_deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Optional index for mobile search
userSchema.index({ mobile: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
