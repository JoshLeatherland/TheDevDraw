import { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Alert,
  Grid,
} from "@mui/material";
import { createFaviconIco } from "../../utils";

type GeneratedIcon = {
  size: number;
  dataUrl: string;
};

function FaviconGeneratorTool() {
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await img.decode();

      const sizes = [32, 48, 64, 96, 128, 256];
      const generated: GeneratedIcon[] = sizes.map((size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);
        return { size, dataUrl: canvas.toDataURL("image/png") };
      });

      setIcons(generated);
      setError(null);
    } catch {
      setError("Failed to process the uploaded image.");
    }
  };

  const downloadPng = (icon: GeneratedIcon) => {
    const a = document.createElement("a");
    a.href = icon.dataUrl;
    a.download = `icon-${icon.size}x${icon.size}.png`;
    a.click();
  };

  const downloadIco = async (icon: GeneratedIcon) => {
    try {
      const icoBlob = await createFaviconIco([icon.dataUrl]);
      const url = URL.createObjectURL(icoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `favicon-${icon.size}x${icon.size}.ico`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(`Failed to generate favicon.ico for ${icon.size}x${icon.size}`);
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
        <Card sx={{ borderRadius: 2, mt: 4 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={600} mb={2}>
              Favicon Generator
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Upload an image to generate PNG and ICO favicons at multiple
              sizes.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button variant="contained" component="label" sx={{ mb: 3 }}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
              />
            </Button>

            <Grid container spacing={2}>
              {icons.map((icon) => (
                <Grid key={icon.size} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={2} alignItems="center">
                        <img
                          src={icon.dataUrl}
                          alt={`${icon.size}x${icon.size}`}
                          width={icon.size}
                          height={icon.size}
                          style={{ borderRadius: 6 }}
                        />

                        <Typography variant="body2" fontWeight={500}>
                          {icon.size} × {icon.size}
                        </Typography>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          width="100%"
                        >
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => downloadPng(icon)}
                          >
                            PNG
                          </Button>

                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => downloadIco(icon)}
                          >
                            Favicon
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default FaviconGeneratorTool;
