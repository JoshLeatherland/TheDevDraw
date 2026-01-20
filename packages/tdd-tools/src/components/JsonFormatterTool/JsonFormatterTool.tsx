import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import { CodePreview } from "tdd-components";

function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [input, output]);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError(null);
      setMessage("This is valid JSON.");
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={600} mb={1}>
              JSON Formatter & Validator
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Format, validate and minify JSON instantly
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {message && <Alert severity="success">{message}</Alert>}

            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <CodePreview
                      title="Input JSON"
                      value={input}
                      readOnly={false}
                      onChange={(val) => setInput(val)}
                      language="json"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <CodePreview
                      title="Output"
                      value={output}
                      language="json"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3} flexWrap="wrap">
              <Button variant="contained" onClick={formatJson}>
                Format
              </Button>
              <Button variant="outlined" onClick={minifyJson}>
                Minify
              </Button>
              <Button variant="outlined" onClick={validateJson}>
                Validate
              </Button>
              <Button variant="outlined" onClick={clearAll}>
                Clear
              </Button>
              <Button
                variant="outlined"
                onClick={copyOutput}
                disabled={!output}
              >
                Copy Output
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Copied to clipboard"
      />
    </Box>
  );
}

export default JsonFormatterTool;
