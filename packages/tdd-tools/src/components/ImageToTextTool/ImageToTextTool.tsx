import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

type FileKind = "image" | "pdf";

type OcrLang = { code: string; label: string };

const LANGUAGES: OcrLang[] = [
  { code: "eng", label: "English" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "spa", label: "Spanish" },
  { code: "ita", label: "Italian" },
  { code: "por", label: "Portuguese" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "jpn", label: "Japanese" },
  { code: "ara", label: "Arabic" },
  { code: "rus", label: "Russian" },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1,
  );
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function ImageToTextTool() {
  const [fileKind, setFileKind] = useState<FileKind | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfPages, setPdfPages] = useState(0);
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [currentOcrPage, setCurrentOcrPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  const loadFile = useCallback(async (file: File) => {
    setError(null);
    setText("");
    setProgress(0);
    setProgressLabel("");
    setCurrentOcrPage(0);

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
        pdfDocRef.current = doc;
        setPdfPages(doc.numPages);
        setFileKind("pdf");
        setSourceFile(file);

        // Render first page as preview
        const firstPage = await doc.getPage(1);
        const vp = firstPage.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await firstPage.render({
          canvasContext: canvas.getContext("2d")!,
          viewport: vp,
        }).promise;
        setPreviewUrl(canvas.toDataURL("image/png"));
      } catch {
        setError(
          "Could not load PDF - it may be corrupted or password-protected.",
        );
      }
      return;
    }

    if (file.type.startsWith("image/")) {
      pdfDocRef.current = null;
      setPdfPages(0);
      setFileKind("image");
      setSourceFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return url;
      });
      return;
    }

    setError("Please upload an image (PNG, JPG, WebP…) or a PDF.");
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadFile(f);
      e.target.value = "";
    },
    [loadFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) loadFile(f);
    },
    [loadFile],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const item = Array.from(e.clipboardData.items).find((i) =>
        i.type.startsWith("image/"),
      );
      if (item) {
        const f = item.getAsFile();
        if (f) loadFile(f);
      }
    },
    [loadFile],
  );

  const runOCR = useCallback(async () => {
    if (!sourceFile) return;
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setText("");

    try {
      const worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          setProgressLabel(m.status);
          setProgress(Math.round(m.progress * 100));
        },
      });

      if (fileKind === "pdf" && pdfDocRef.current) {
        const doc = pdfDocRef.current;
        const parts: string[] = [];

        for (let p = 1; p <= doc.numPages; p++) {
          setCurrentOcrPage(p);
          setProgressLabel(`Rendering page ${p} of ${doc.numPages}…`);
          setProgress(0);

          // Render at 2× scale - higher resolution improves OCR accuracy
          const page = await doc.getPage(p);
          const vp = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({
            canvasContext: canvas.getContext("2d")!,
            viewport: vp,
          }).promise;

          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/png"),
          );

          const {
            data: { text: pageText },
          } = await worker.recognize(blob);

          if (pageText.trim()) {
            parts.push(
              doc.numPages > 1
                ? `--- Page ${p} ---\n\n${pageText.trim()}`
                : pageText.trim(),
            );
          }
        }

        setText(parts.join("\n\n"));
      } else {
        const {
          data: { text: result },
        } = await worker.recognize(sourceFile);
        setText(result.trim());
      }

      await worker.terminate();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`OCR failed: ${msg}`);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressLabel("");
      setCurrentOcrPage(0);
    }
  }, [sourceFile, fileKind, lang]);

  const copyText = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const downloadText = useCallback(() => {
    if (!text) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [text]);

  const hasFile = !!sourceFile;

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 10, sm: 12 }, pb: 4 }}>
      <Stack spacing={3} onPaste={onPaste}>
        {/* Header */}
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Image to Text (OCR)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Extract text from images or PDFs using OCR - runs entirely in your
            browser, nothing is uploaded to a server.
          </Typography>
        </Box>

        {/* Drop / upload zone */}
        <Paper
          variant="outlined"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          tabIndex={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: previewUrl ? "auto" : 240,
            p: previewUrl ? 2 : 4,
            gap: 2,
            cursor: previewUrl ? "default" : "pointer",
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            transition: "border-color 0.15s",
            "&:hover": {
              borderColor: previewUrl ? "divider" : "primary.main",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
            },
          }}
          onClick={() => {
            if (!previewUrl) fileInputRef.current?.click();
          }}
        >
          {previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt="Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: 420,
                objectFit: "contain",
                borderRadius: 1,
                display: "block",
              }}
            />
          ) : (
            <>
              <ImageSearchIcon sx={{ fontSize: 56, color: "text.disabled" }} />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  Drop a file here, paste from clipboard, or click to browse
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  PNG · JPG · GIF · BMP · TIFF · WebP · PDF
                </Typography>
              </Box>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*,application/pdf"
            onChange={onFileChange}
          />
        </Paper>

        {/* File info + replace */}
        {sourceFile && (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {fileKind === "pdf" ? (
              <PictureAsPdfIcon fontSize="small" color="error" />
            ) : null}
            <Typography variant="caption" color="text.secondary">
              {sourceFile.name} · {formatBytes(sourceFile.size)}
              {fileKind === "pdf" &&
                ` · ${pdfPages} page${pdfPages !== 1 ? "s" : ""}`}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ ml: "auto" }}
            >
              Replace
            </Button>
          </Stack>
        )}

        {/* Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
        >
          {/* Language selector - Typography label above to avoid theme floating-label issues */}
          <Stack spacing={0.5}>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              Language
            </Typography>
            <Select
              size="small"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              disabled={isProcessing}
              sx={{ minWidth: 200 }}
            >
              {LANGUAGES.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  {l.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Button
            variant="contained"
            startIcon={
              isProcessing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ImageSearchIcon />
              )
            }
            disabled={!hasFile || isProcessing}
            onClick={runOCR}
            sx={{ height: 36, alignSelf: { xs: "stretch", sm: "flex-end" } }}
          >
            {isProcessing ? "Extracting…" : "Extract Text"}
          </Button>
        </Stack>

        {/* Progress */}
        {isProcessing && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block", textTransform: "capitalize" }}
            >
              {currentOcrPage > 0
                ? `Page ${currentOcrPage} of ${pdfPages} - ${progressLabel || "…"}`
                : progressLabel || "Initialising…"}
            </Typography>
            <LinearProgress
              variant={progress > 0 ? "determinate" : "indeterminate"}
              value={progress}
            />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Result */}
        {text && (
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              {/* Label above textarea - avoids theme floating-label overlap */}
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                Extracted Text
                <Typography
                  component="span"
                  variant="caption"
                  color="text.disabled"
                  sx={{ ml: 1 }}
                >
                  {text.length.toLocaleString()} chars
                </Typography>
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                  <IconButton size="small" onClick={copyText}>
                    {copied ? (
                      <CheckIcon fontSize="small" color="success" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download as .txt">
                  <IconButton size="small" onClick={downloadText}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            {/* variant="filled" avoids MuiOutlinedInput's fixed-height theme override */}
            <TextField
              fullWidth
              multiline
              variant="filled"
              minRows={6}
              maxRows={24}
              value={text}
              onChange={(e) => setText(e.target.value)}
              slotProps={{
                input: { sx: { fontFamily: "monospace", fontSize: 13 } },
              }}
              helperText="You can edit the extracted text before copying or downloading."
            />
          </Box>
        )}

        {/* Idle hint */}
        {!isProcessing && hasFile && !text && !error && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Select a language and click Extract Text to begin.
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
