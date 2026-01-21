import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { CodePreview } from "tdd-components";

function JsonToCSharpTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rootClass, setRootClass] = useState("RootObject");
  const [usePascalCase, setUsePascalCase] = useState(true);

  useEffect(() => {
    setOutput("");
    setError(null);
  }, [input, rootClass, usePascalCase]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sanitizePropertyName = (key: string): string => {
    const cleaned = key.replace(/[^a-zA-Z0-9_]/g, "_");
    return usePascalCase ? pascalCase(cleaned) : cleaned;
  };

  const pascalCase = (str: string) =>
    str.replace(/(^\w|_\w)/g, (m) => m.replace("_", "").toUpperCase());

  const toCSharpType = (value: any): string => {
    if (value === null) return "object";
    if (Array.isArray(value)) {
      const arrayType = value.length > 0 ? toCSharpType(value[0]) : "object";
      return `${arrayType}[]`;
    }
    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return Number.isInteger(value) ? "int" : "double";
      case "boolean":
        return "bool";
      case "object":
        return "object";
      default:
        return "object";
    }
  };

  const generateCSharp = (json: any, className: string): string => {
    const classes: string[] = [];
    const props: string[] = [];

    for (const key in json) {
      const propName = sanitizePropertyName(key);
      const val = json[key];

      if (val && typeof val === "object" && !Array.isArray(val)) {
        // nested object
        const nestedClassName = propName;
        classes.push(generateCSharp(val, nestedClassName));
        props.push(
          `    public ${nestedClassName} ${propName} { get; set; } = new ${nestedClassName}();`,
        );
      } else if (
        Array.isArray(val) &&
        val.length > 0 &&
        typeof val[0] === "object"
      ) {
        // array of objects
        const nestedClassName = propName + "Item";
        classes.push(generateCSharp(val[0], nestedClassName));
        props.push(
          `    public ${nestedClassName}[] ${propName} { get; set; } = [];`,
        );
      } else {
        const typeName = toCSharpType(val);
        const defaultVal =
          typeName === "string"
            ? '""'
            : typeName === "bool"
              ? "false"
              : typeName.endsWith("[]")
                ? "[]"
                : "0";
        props.push(
          `    public ${typeName} ${propName} { get; set; } = ${defaultVal};`,
        );
      }
    }

    classes.unshift(`public class ${className}\n{\n${props.join("\n")}\n}`);
    return classes.join("\n\n");
  };

  const generate = () => {
    try {
      const parsed = JSON.parse(input);
      const code = generateCSharp(parsed, rootClass);
      setOutput(code);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
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
              JSON → C# Model Generator
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Generate C# classes from JSON input
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

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
                      title="Generated C#"
                      value={output}
                      language="csharp"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3} flexWrap="wrap">
              <TextField
                variant="filled"
                label="Root Class Name"
                value={rootClass}
                onChange={(e) => setRootClass(e.target.value)}
              />
              <Button variant="contained" onClick={generate}>
                Generate
              </Button>
              <Button
                variant="outlined"
                onClick={handleCopy}
                disabled={!output}
              >
                Copy Output
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError(null);
                }}
              >
                Clear
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

export default JsonToCSharpTool;
