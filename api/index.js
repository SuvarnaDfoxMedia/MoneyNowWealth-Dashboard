import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDatabase from "./db/db.js";
import helmet from "helmet";
import cors from "cors";
import testRoutes from "./routes/testRoutes.js";
import cookieParser from "cookie-parser";
import { protect } from "./middleware/authMiddleware.js";
import { authorizeRoles } from "./middleware/authMiddleware.js";
import profileRoutes from "./routes/profileRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import blogCategoryRoutes from "./routes/blogCategoryRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();



// Database config
await connectDatabase();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/uploads/blog', express.static(path.join(__dirname, 'uploads/blog'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // frontend origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // allow cross-origin images
  }
})); // Serve images

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.use("/api", newsletterRoutes);
app.use("/api", blogRoutes);
app.use("/api", contactRoutes);
app.use("/api", blogCategoryRoutes);

//  Protected routes for role-based access
// app.get("/api/profile", protect, (req, res) => {
//   res.json({ message: "Welcome to your profile", user: req.user });
// });

//blog


app.use("/api/profile", profileRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
//----
//
app.get("/api/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin dashboard: Access granted" });
});

app.get("/api/editor", protect, authorizeRoles("editor"), (req, res) => {
  res.json({ message: "Editor panel: Access granted" });
});


// Root route
app.get("/", (req, res) => {
  res.send("Backend is working !!!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:${process.env.PORT}`);
});
