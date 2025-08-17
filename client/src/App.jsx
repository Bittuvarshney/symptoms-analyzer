import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Button, Container, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import DiseaseManager from "./components/diseasemanager";
import SymptomAnalyzer from "./components/SymptomAnalyzer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Box>

        <DiseaseManager />
        <Box mt={5}>
          <SymptomAnalyzer />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
