import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import connectDatabase from "./db/db.js";

dotenv.config();
//datbase config
connectDatabase;
const app = express();

app.use(express.json());
app.use("/uploads/blog", express.static("api/uploads/blog")); // Serve images

// Routes
app.use("/api", blogRoutes);

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port:${process.env.PORT}`)
})