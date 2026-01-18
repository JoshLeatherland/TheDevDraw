import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { generateTsInterfaces } from "../../utils/csharpToTsGenerator";

function CSharpToTsTool() {
  const [csharp, setCsharp] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOutput("");
  }, [csharp]);

  const generate = () => {
    try {
      setError(null);
      const result = generateTsInterfaces(csharp);
      setOutput(result);
    } catch (err: any) {
      setOutput("");
      setError(err.message || "Failed to parse C# models.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={600}>
                C# Model → TypeScript Interface
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="C# Models"
                    multiline
                    minRows={14}
                    maxRows={25}
                    fullWidth
                    variant="filled"
                    placeholder="Paste your C# models here..."
                    value={csharp}
                    onChange={(e) => setCsharp(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="TypeScript Interfaces"
                    multiline
                    minRows={14}
                    fullWidth
                    variant="filled"
                    value={output}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={generate}>
                  Generate Interfaces
                </Button>

                {output && (
                  <IconButton onClick={copy}>
                    <ContentCopyIcon />
                  </IconButton>
                )}
              </Stack>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default CSharpToTsTool;
