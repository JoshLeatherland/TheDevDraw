import { useState } from "react";
import { copyToClipboard } from "../../utils";
import { usePasswordGenerator } from "../../hooks";
import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import PasswordDisplay from "./PasswordDisplay";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import CustomizePassword from "./CustomizePassword";

function PasswordGenerator() {
  const {
    password,
    strength,
    length,
    setLength,
    hasUppercase,
    setHasUppercase,
    hasLowercase,
    setHasLowercase,
    hasNumbers,
    setHasNumbers,
    hasSymbols,
    setHasSymbols,
    generatePassword,
  } = usePasswordGenerator();

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleCopyToClipboard = () => {
    copyToClipboard(password);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="20px"
            >
              <Typography variant="h6">Password Generator</Typography>
            </Box>

            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                marginBottom: "20px",
                textAlign: "center",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              <PasswordDisplay
                password={password}
                onCopy={handleCopyToClipboard}
                onGenerate={generatePassword}
              />
              <PasswordStrengthIndicator strength={strength} />
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: "20px",
              }}
            >
              <CustomizePassword
                length={length}
                setLength={setLength}
                hasUppercase={hasUppercase}
                setHasUppercase={setHasUppercase}
                hasLowercase={hasLowercase}
                setHasLowercase={setHasLowercase}
                hasNumbers={hasNumbers}
                setHasNumbers={setHasNumbers}
                hasSymbols={hasSymbols}
                setHasSymbols={setHasSymbols}
              />
            </Paper>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          message="Password copied to clipboard!"
        />
      </Container>
    </Box>
  );
}

export default PasswordGenerator;
