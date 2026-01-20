import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import { CodePreview } from "tdd-components";
import { format } from "sql-formatter";

function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [input, output]);

  const formatSql = () => {
    try {
      const formatted = format(input, {
        language: "tsql",
        tabWidth: 2,
        useTabs: false,
        keywordCase: "upper",
        linesBetweenQueries: 2,
        indentStyle: "standard",
        denseOperators: false,
        newlineBeforeSemicolon: true,
        expressionWidth: 80,
        logicalOperatorNewline: "before",
      });

      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid SQL");
      setOutput("");
    }
  };

  const minifySql = () => {
    try {
      const minified = format(input, {
        language: "tsql",
        keywordCase: "upper",
        linesBetweenQueries: 0,
      })
        .replace(/\s+/g, " ")
        .trim();

      setOutput(minified);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid SQL");
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
              SQL Formatter
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Format and beautify SQL queries instantly
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}

            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <CodePreview
                      title="Input SQL"
                      value={input}
                      readOnly={false}
                      onChange={(val) => setInput(val)}
                      language="sql"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <CodePreview
                      title="Formatted Output"
                      value={output}
                      language="sql"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3} flexWrap="wrap">
              <Button variant="contained" onClick={formatSql}>
                Format
              </Button>
              <Button variant="outlined" onClick={minifySql}>
                Minify
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

export default SqlFormatterTool;
