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
import { useCallback, useState } from "react";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function ImageToBase64Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>("");
  const [includeDataUri, setIncludeDataUri] = useState(true);

  const handleFile = useCallback(
    (selected: File) => {
      if (!selected.type.startsWith("image/")) return;

      setFile(selected);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);

        if (includeDataUri) {
          setBase64(result);
        } else {
          setBase64(result.split(",")[1] ?? "");
        }
      };

      reader.readAsDataURL(selected);
    },
    [includeDataUri],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(base64);
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
              Image to Base64
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Convert images into Base64 strings for API testing and payload
              generation.
            </Typography>

            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                <Box
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("image-input")?.click()
                  }
                >
                  <Typography variant="body1" gutterBottom>
                    Drag & drop an image here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to select a file
                  </Typography>

                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onFileChange}
                  />
                </Box>
              </CardContent>
            </Card>

            {file && preview && (
              <Stack spacing={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview
                    </Typography>

                    <Box
                      component="img"
                      src={preview}
                      alt="Preview"
                      sx={{
                        maxWidth: 200,
                        maxHeight: 200,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />

                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {file.name} · {formatBytes(file.size)}
                    </Typography>
                  </CardContent>
                </Card>

                <FormControlLabel
                  control={
                    <Switch
                      checked={includeDataUri}
                      onChange={(e) => {
                        setIncludeDataUri(e.target.checked);
                        setBase64(
                          e.target.checked
                            ? preview
                            : (preview.split(",")[1] ?? ""),
                        );
                      }}
                    />
                  }
                  label="Include data:image/...;base64 prefix"
                />

                <TextField
                  variant="filled"
                  label="Base64 Output"
                  value={base64}
                  multiline
                  minRows={6}
                  maxRows={10}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleCopy}>
                    Copy to Clipboard
                  </Button>

                  <Typography variant="caption" sx={{ alignSelf: "center" }}>
                    Length: {base64.length.toLocaleString()} characters
                  </Typography>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ImageToBase64Tool;
