import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5174" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: Object.values(err.errors)[0].message });
  }
  if (err.name === "CastError")
    return res.status(400).json({ message: "Invalid id" });
  if (err.code === 11000)
    return res.status(409).json({ message: "Email is already registered" });
  res
    .status(err.status || 500)
    .json({ message: err.status ? err.message : "Server error" });
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(port, () => console.log(`API running on port ${port}`)),
  )
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
