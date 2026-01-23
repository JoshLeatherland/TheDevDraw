import { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import { v4 as uuidv4, v7 as uuidv7, validate, version } from "uuid";

function UuidTool() {
  const [count, setCount] = useState(1);
  const [generated, setGenerated] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<
    { value: string; valid: boolean; version?: number }[]
  >([]);

  const generate = (type: "v4" | "v7") => {
    const list = Array.from({ length: count }, () =>
      type === "v4" ? uuidv4() : uuidv7(),
    );
    setGenerated(list);
  };

  const validateInput = () => {
    const values = input
      .split(/[\s,]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    const checked = values.map((v) => {
      const isValid = validate(v);
      return {
        value: v,
        valid: isValid,
        version: isValid ? version(v) : undefined,
      };
    });

    setResults(checked);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(generated.join("\n"));
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
        <Card sx={{ borderRadius: 2, mt: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={600} mb={1}>
              UUID Generator & Validator
            </Typography>

            <Typography color="text.secondary" mb={3}>
              Generate UUIDs (v4 / v7) and validate existing values.
            </Typography>

            <Stack spacing={2} mb={4}>
              <Typography fontWeight={600}>Generate</Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ sm: "center" }}
              >
                <TextField
                  variant="filled"
                  label="How many?"
                  type="number"
                  size="small"
                  value={count}
                  inputProps={{ min: 1, max: 100 }}
                  onChange={(e) => setCount(Number(e.target.value))}
                  sx={{ width: 140 }}
                />

                <Button variant="outlined" onClick={() => generate("v4")}>
                  Generate v4
                </Button>

                <Button variant="contained" onClick={() => generate("v7")}>
                  Generate v7
                </Button>

                {generated.length > 0 && (
                  <Button onClick={copyAll}>Copy all</Button>
                )}
              </Stack>

              {generated.length > 0 && (
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "background.default",
                    fontSize: 13,
                    overflowX: "auto",
                    maxHeight: "30em",
                  }}
                >
                  {generated.join("\n")}
                </Box>
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Typography fontWeight={600}>Validate</Typography>

              <TextField
                variant="filled"
                multiline
                minRows={4}
                maxRows={20}
                placeholder="Paste UUIDs here (comma, space or newline separated)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <Button variant="contained" onClick={validateInput}>
                Validate
              </Button>

              {results.length > 0 && (
                <Stack spacing={1} maxHeight="30rem" overflow="auto">
                  {results.map((r, i) => (
                    <Box
                      key={i}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <Typography
                        fontFamily="monospace"
                        fontSize={13}
                        sx={{ wordBreak: "break-all" }}
                      >
                        {r.value}
                      </Typography>

                      {r.valid ? (
                        <Chip
                          label={`Valid (v${r.version})`}
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip label="Invalid" color="error" size="small" />
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default UuidTool;
