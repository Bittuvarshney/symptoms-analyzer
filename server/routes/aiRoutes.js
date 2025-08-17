import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

// Gemini Init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: "No symptoms provided" });
    }

    // Prepare input
    const prompt = `The patient has the following symptoms: ${symptoms.join(
      ", "
    )}. Based on this, suggest a possible disease or condition in 2-3 sentences.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ disease: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
