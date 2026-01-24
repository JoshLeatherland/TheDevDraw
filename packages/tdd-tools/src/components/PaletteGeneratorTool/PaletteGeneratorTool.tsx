import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Stack,
  Container,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const randomHex = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;

type PaletteColor = {
  hex: string;
  locked: boolean;
};

function PaletteGeneratorTool() {
  const [palette, setPalette] = useState<PaletteColor[]>(
    Array.from({ length: 5 }, () => ({ hex: randomHex(), locked: false })),
  );
  const [error, setError] = useState<string | null>(null);

  const regenerate = () => {
    setPalette((prev) =>
      prev.map((c) => (c.locked ? c : { ...c, hex: randomHex() })),
    );
  };

  const toggleLock = (index: number) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c)),
    );
  };

  const updateHex = (index: number, value: string) => {
    if (!/^#?[0-9a-fA-F]{0,6}$/.test(value)) return;
    if (!value.startsWith("#") && value.length > 0) value = "#" + value;
    setPalette((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex: value } : c)),
    );
  };

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      setError("Failed to copy HEX code.");
      setTimeout(() => setError(null), 2000);
    }
  };

  const exportCss = () => {
    const cssVars = palette
      .map((c, i) => `--color-${i + 1}: ${c.hex};`)
      .join("\n");
    const blob = new Blob([cssVars], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.css";
    a.click();
    URL.revokeObjectURL(url);
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
        <Card sx={{ borderRadius: 2, mt: 2 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={600} mb={2}>
              Palette Generator
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Generate random color palettes, lock colors, edit HEX codes, copy,
              or export.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              {palette.map((color, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Card sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        backgroundColor: color.hex,
                        height: 120,
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                    <CardContent>
                      <Stack spacing={1} alignItems="center">
                        <Typography
                          variant="body2"
                          p={1}
                          color="text.secondary"
                        >
                          {color.hex}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            size="small"
                            value={color.hex}
                            onChange={(e) => updateHex(i, e.target.value)}
                            inputProps={{
                              maxLength: 7,
                              style: { textAlign: "center" },
                            }}
                          />

                          <Tooltip title={color.locked ? "Unlock" : "Lock"}>
                            <IconButton
                              size="small"
                              onClick={() => toggleLock(i)}
                            >
                              {color.locked ? <LockIcon /> : <LockOpenIcon />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Copy HEX">
                            <IconButton
                              size="small"
                              onClick={() => copyHex(color.hex)}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
              <Button variant="contained" onClick={regenerate}>
                Regenerate Palette
              </Button>
              <Button variant="outlined" onClick={exportCss}>
                Export as CSS
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default PaletteGeneratorTool;
