import express from "express";
import connectDB from "./db.js";
import dotenv from "dotenv";

import userRoutes from "../routes/userRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import borrowRoutes from "../routes/borrowRoutes.js";
import reportRoutes from "../routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Set up API routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/reports", reportRoutes);

export default app;
