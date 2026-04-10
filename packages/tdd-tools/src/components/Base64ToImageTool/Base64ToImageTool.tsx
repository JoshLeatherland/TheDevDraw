import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
  TextField,
  Container,
} from "@mui/material";
import { useMemo, useState } from "react";

function Base64ToImageTool() {
  const [input, setInput] = useState<string>("");
  const [includeDataUri, setIncludeDataUri] = useState(true);

  const imageSrc = useMemo(() => {
    if (!input) return null;

    try {
      if (input.startsWith("data:image")) {
        return input;
      }

      if (includeDataUri) {
        return `data:image/png;base64,${input}`;
      }

      return null;
    } catch {
      return null;
    }
  }, [input, includeDataUri]);

  const handleDownload = () => {
    if (!imageSrc) return;

    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "image.png";
    link.click();
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
        <Card sx={{ borderRadius: 2, mt: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Base64 to Image
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Convert Base64 strings back into images for preview and download.
            </Typography>

            <Stack spacing={3}>
              <TextField
                variant="filled"
                label="Base64 Input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                multiline
                minRows={6}
                maxRows={10}
                fullWidth
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={includeDataUri}
                    onChange={(e) =>
                      setIncludeDataUri(e.target.checked)
                    }
                  />
                }
                label="Auto add data:image/png;base64 prefix"
              />

              {imageSrc && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview
                    </Typography>

                    <Box
                      component="img"
                      src={imageSrc}
                      alt="Preview"
                      sx={{
                        maxWidth: 200,
                        maxHeight: 200,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleDownload}
                  disabled={!imageSrc}
                >
                  Download Image
                </Button>

                <Typography variant="caption" sx={{ alignSelf: "center" }}>
                  Length: {input.length.toLocaleString()} characters
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Base64ToImageTool;