import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }

      setError(null);
    } catch {
      setError("Invalid input for selected mode");
      setOutput("");
    }
  }, [input, mode]);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={600}>
                Base64 Encoder / Decoder
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant={mode === "encode" ? "contained" : "outlined"}
                  onClick={() => setMode("encode")}
                >
                  Encode
                </Button>

                <Button
                  fullWidth
                  variant={mode === "decode" ? "contained" : "outlined"}
                  onClick={() => setMode("decode")}
                >
                  Decode
                </Button>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <Typography fontWeight={600}>
                      {mode === "encode" ? "Plain Text" : "Base64"}
                    </Typography>

                    <TextField
                      variant="filled"
                      multiline
                      minRows={8}
                      maxRows={16}
                      fullWidth
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        mode === "encode"
                          ? "Enter text to encode..."
                          : "Enter Base64 to decode..."
                      }
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <Typography fontWeight={600}>
                      {mode === "encode" ? "Base64 Output" : "Decoded Output"}
                    </Typography>

                    <TextField
                      variant="filled"
                      multiline
                      minRows={8}
                      maxRows={16}
                      fullWidth
                      value={output}
                      InputProps={{ readOnly: true }}
                    />

                    <Button
                      variant="contained"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copy(output)}
                    >
                      Copy Output
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Base64Tool;
