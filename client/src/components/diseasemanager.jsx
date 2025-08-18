import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const DiseaseManager = () => {
  const [diseases, setDiseases] = useState([]);
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchDiseases = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/diseases`);
      setDiseases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching diseases:", err);
      setDiseases([]);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const diseaseData = {
      name,
      symptoms: symptoms.split(",").map((s) => s.trim()),
      description,
    };

    try {
      let response;
      if (editingId) {
        response = await axios.put(
          `${API_BASE_URL}/api/diseases/${editingId}`,
          diseaseData
        );
        setEditingId(null);
      } else {
        response = await axios.post(`${API_BASE_URL}/api/diseases`, diseaseData);
      }

      setName("");
      setSymptoms("");
      setDescription("");
      fetchDiseases();

      if (response?.data?._id) {
        setHighlightedRow(response.data._id);
        setTimeout(() => setHighlightedRow(null), 2000);
      }
    } catch (err) {
      console.error("Error saving disease:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/diseases/${id}`);
      fetchDiseases();
    } catch (err) {
      console.error("Error deleting disease:", err);
    }
  };

  const handleEdit = (disease) => {
    setEditingId(disease._id);
    setName(disease.name);
    setSymptoms(disease.symptoms.join(", "));
    setDescription(disease.description);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        🩺 Disease Manager
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          {editingId ? "Edit Disease" : "Add New Disease"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mt: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Symptoms (comma separated)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            {editingId ? "Update" : "Add"} Disease
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Symptoms</TableCell>
              <TableCell sx={{ color: "#fff" }}>Description</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diseases.map((d) => (
              <TableRow
                key={d._id}
                sx={{
                  bgcolor:
                    highlightedRow === d._id
                      ? "rgba(76, 175, 80, 0.3)"
                      : "inherit",
                  transition: "background-color 1s ease",
                }}
              >
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.symptoms.join(", ")}</TableCell>
                <TableCell>{d.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(d)}>
                    <FiEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(d._id)}>
                    <FiTrash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DiseaseManager;
