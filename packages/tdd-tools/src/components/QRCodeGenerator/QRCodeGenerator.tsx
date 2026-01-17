import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Slider,
  InputLabel,
  Container,
} from "@mui/material";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

function QRCodeGenerator() {
  const [value, setValue] = useState("TheDevDraw");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadPng = async () => {
    if (!qrRef.current) return;

    const dataUrl = await toPng(qrRef.current, {
      cacheBust: true,
      pixelRatio: 3,
    });

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = dataUrl;
    link.click();
  };

  const downloadSvg = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
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
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={600}>
                QR Code Generator
              </Typography>

              <TextField
                variant="filled"
                label="Text or URL"
                placeholder="https://example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  variant="filled"
                  label="Foreground"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  fullWidth
                />

                <TextField
                  variant="filled"
                  label="Background"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  fullWidth
                />
              </Stack>

              <Box>
                <InputLabel>QR Size ({size}px)</InputLabel>
                <Slider
                  min={128}
                  max={512}
                  step={32}
                  value={size}
                  onChange={(_, v) => setSize(v as number)}
                />
              </Box>

              <Button variant="contained" component="label">
                Upload Logo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>

              {logo && (
                <Button
                  variant="outlined"
                  component="label"
                  onClick={() => setLogo(null)}
                >
                  Clear Logo
                </Button>
              )}

              {value && (
                <Stack spacing={2} alignItems="center">
                  <Box
                    ref={qrRef}
                    sx={{
                      position: "relative",
                      background: bgColor,
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <QRCode
                      value={value}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="H"
                    />

                    {logo && (
                      <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: size * 0.25,
                          height: size * 0.25,
                          transform: "translate(-50%, -50%)",
                          borderRadius: 2,
                          background: "#fff",
                          p: 1,
                        }}
                      />
                    )}
                  </Box>

                  <Stack direction="row" spacing={2} width="100%">
                    <Button fullWidth variant="contained" onClick={downloadPng}>
                      Export PNG
                    </Button>

                    <Button fullWidth variant="outlined" onClick={downloadSvg}>
                      Export SVG
                    </Button>
                  </Stack>

                  {logo && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      SVG export does not support embedded logos. Use PNG for
                      branded QR codes.
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default QRCodeGenerator;
