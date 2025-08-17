import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import diseaseRoutes from "./routes/diseasesroute.js";
import analyzeRoutes from "./routes/analyzeroutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/diseases", diseaseRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
