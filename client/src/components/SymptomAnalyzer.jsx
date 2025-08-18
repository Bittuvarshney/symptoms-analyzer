import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

// Motion Wrappers
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionTextField = motion(TextField);

const SymptomAnalyzer = () => {
  const [inputSymptoms, setInputSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Analyze Function
  const handleAnalyze = async () => {
    if (!inputSymptoms.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(" https://symptoms-analyzer.onrender.com/api/analyze", {
        symptoms: inputSymptoms.split(",").map((s) => s.trim()),
      });

      if (res.data?.diseaseFound) {
        setResult({ source: "Database", disease: res.data.disease });
      } else {
        const aiRes = await axios.post(" https://symptoms-analyzer.onrender.com/api/ai/", {
          symptoms: inputSymptoms.split(",").map((s) => s.trim()),
        });
        setResult({ source: "AI", disease: aiRes.data.disease });
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to analyze symptoms. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionBox
      maxWidth="sm"
      component={Container}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      sx={{
        mt: 5,
        mb: 5,
        p: 3,
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "#fff" : "#000",
        borderRadius: 3,
        minHeight: "70vh",
        boxShadow: 5,
      }}
    >
      {/* Header + Dark Mode */}
      <MotionBox
        display="flex"
        justifyContent="space-between"
        mb={3}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Symptom Analyzer
        </Typography>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </motion.div>
      </MotionBox>

      {/* Input Field */}
      <MotionTextField
        fullWidth
        label="Enter symptoms (comma separated)"
        variant="outlined"
        value={inputSymptoms}
        onChange={(e) => setInputSymptoms(e.target.value)}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        sx={{
          mb: 2,
          backgroundColor: darkMode ? "#2c2c2c" : "#fff",
          input: { color: darkMode ? "#fff" : "#000" },
          label: { color: darkMode ? "#aaa" : "#000" },
          borderRadius: 1,
        }}
      />

      {/* Analyze Button */}
      <MotionButton
        variant="contained"
        color="primary"
        onClick={handleAnalyze}
        fullWidth
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        sx={{ mb: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze"}
      </MotionButton>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        </motion.div>
      )}

      {/* Result Section */}
      {result && (
        <MotionCard
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          sx={{
            mb: 2,
            backgroundColor: darkMode ? "#1e1e1e" : "#fff",
            color: darkMode ? "#fff" : "#000",
            borderRadius: 2,
            boxShadow: 6,
          }}
        >
          <CardContent>
            <Typography variant="h6">
              {result.source === "AI"
                ? `AI Suggestion: ${result.disease}`
                : `Disease: ${result.disease.name}`}
            </Typography>

            {result.source === "Database" && (
              <>
                <Typography variant="body2" mb={1}>
                  Symptoms: {result.disease.symptoms.join(", ")}
                </Typography>
                <Typography variant="body2">
                  {result.disease.description}
                </Typography>
              </>
            )}
          </CardContent>
        </MotionCard>
      )}

      {/* No Result */}
      {!result && !loading && inputSymptoms && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography>No disease found for entered symptoms.</Typography>
        </motion.div>
      )}
    </MotionBox>
  );
};

export default SymptomAnalyzer;
