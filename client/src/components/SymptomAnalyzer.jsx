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

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);
const MotionTextField = motion.create(TextField);

const SymptomAnalyzer = () => {
  const [inputSymptoms, setInputSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  console.log("API_BASE_URL:", API_BASE_URL); // Check env variable

  const handleAnalyze = async () => {
    if (!inputSymptoms.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/analyze`, {
        symptoms: inputSymptoms.split(",").map((s) => s.trim()),
      });

      if (res.data?.diseaseFound) {
        setResult({ source: "Database", disease: res.data.disease });
      } else {
        const aiRes = await axios.post(`${API_BASE_URL}/api/ai`, {
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
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        gap={{ xs: 2, sm: 0 }}
      >
        <Typography variant="h4">Symptom Analyzer</Typography>
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
      </Box>

      {/* Input */}
      <MotionTextField
        fullWidth
        label="Enter symptoms (comma separated)"
        variant="outlined"
        value={inputSymptoms}
        onChange={(e) => setInputSymptoms(e.target.value)}
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
        sx={{ mb: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze"}
      </MotionButton>

      {/* Error */}
      {error && <Typography color="error" mb={2}>{error}</Typography>}

      {/* Result */}
      {result && (
        <MotionCard
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

      {!result && !loading && inputSymptoms && (
        <Typography>No disease found for entered symptoms.</Typography>
      )}
    </MotionBox>
  );
};

export default SymptomAnalyzer;
