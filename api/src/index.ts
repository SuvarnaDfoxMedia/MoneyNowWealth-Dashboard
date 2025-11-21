import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabase from "./db/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import profileRoutes from "./routes/profileRoutes.ts";
import contactEnquiryRoutes from "./routes/contactEnquiryRoutes.ts";
import testRoutes from "./routes/testRoutes.ts";
import clusterRoutes from "./routes/clusterRoutes.ts";
import cmsPageRoutes from "./routes/cmsPageRoutes.ts";
import topicRoutes from "./routes/topicRoutes.ts";
import articleRoutes from "./routes/articleRoutes.ts";
import subscriptionPlanRoutes from "./routes/subscriptionPlanRoutes.ts";
import uploadRoutes from "./routes/uploadRoutes.ts";
import { protect, authorizeRoles } from "./middleware/authMiddleware.ts";
import uploadImageRouter from "./controllers/uploadImageController.ts";
import { startTopicScheduler } from "./corn/topicScheduler.ts";
import "./corn/subscriptionCron.ts";
import userSubscriptionRoutes from "./routes/userSubscriptionRoutes.ts";
import subscriptionPaymentRoutes from "./routes/userSubscriptionPaymentRoutes.ts";

import newsletterRoutes from "./routes/newsletter.routes.ts";

dotenv.config();
await connectDatabase();
startTopicScheduler();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());
app.use(helmet());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api", uploadRoutes);
app.use("/api", uploadImageRouter);
app.use("/api", clusterRoutes);
app.use("/api", topicRoutes);
app.use("/api", articleRoutes);
app.use("/api", cmsPageRoutes);
app.use("/api", contactEnquiryRoutes);
app.use("/api", subscriptionPlanRoutes);
app.use("/api", userSubscriptionRoutes);
app.use("/api", subscriptionPaymentRoutes);

app.use("/api/newsletters", newsletterRoutes);

app.get("/api/admin", protect, authorizeRoles("admin"), (_req: Request, res: Response) => {
  res.json({ message: "Admin dashboard: Access granted" });
});

app.get("/api/editor", protect, authorizeRoles("editor"), (_req: Request, res: Response) => {
  res.json({ message: "Editor panel: Access granted" });
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is working !!!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
