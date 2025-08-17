import express from "express";
import Disease from "../models/Disease.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: "Symptoms array is required" });
  }

  try {
    // Simple matching: return diseases that have at least one matching symptom
    const diseases = await Disease.find({
      symptoms: { $in: symptoms },
    });

    res.json(diseases);
  } catch (err) {
    console.error("Error analyzing symptoms:", err);
    res.status(500).json({ error: "Failed to analyze symptoms" });
  }
});

export default router;
