import express from "express";
import Disease from "../models/Disease.js";

const router = express.Router();

// GET all diseases
router.get("/", async (req, res) => {
  try {
    const diseases = await Disease.find({});
    res.json(diseases);
  } catch (err) {
    console.error("Error fetching diseases:", err);
    res.status(500).json({ error: "Failed to fetch diseases" });
  }
});

// POST new disease
router.post("/", async (req, res) => {
  let { name, symptoms, description } = req.body;

  if (!name || !symptoms || !description) {
    return res.status(400).json({
      error: "Name, symptoms, and description are required",
    });
  }

  // Convert string to array if needed
  if (typeof symptoms === "string") {
    symptoms = symptoms
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
  }

  try {
    const newDisease = new Disease({ name, symptoms, description });
    await newDisease.save();
    res.status(201).json(newDisease);
  } catch (err) {
    console.error("Error adding disease:", err);
    res.status(500).json({ error: "Failed to add disease" });
  }
});

// DELETE a disease
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Disease.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Disease not found" });
    res.json({ message: "Disease deleted successfully" });
  } catch (err) {
    console.error("Error deleting disease:", err);
    res.status(500).json({ error: "Failed to delete disease" });
  }
});

// UPDATE a disease
router.put("/:id", async (req, res) => {
  const { name, symptoms, description } = req.body;
  try {
    const updated = await Disease.findByIdAndUpdate(
      req.params.id,
      { name, symptoms, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Disease not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating disease:", err);
    res.status(500).json({ error: "Failed to update disease" });
  }
});

export default router;
