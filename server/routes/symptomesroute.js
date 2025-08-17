import express from "express";
import Symptom from "../models/symptoms.js";

const router = express.Router();

// Smart suggestions for symptoms
router.get("/", async (req, res) => {
  const query = req.query.query || "";
  try {
    const symptoms = await Symptom.find({ name: { $regex: query, $options: "i" } }).limit(10);
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
