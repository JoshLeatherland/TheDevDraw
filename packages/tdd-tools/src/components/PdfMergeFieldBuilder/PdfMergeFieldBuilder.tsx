import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NearMeIcon from "@mui/icons-material/NearMe";
import SubjectIcon from "@mui/icons-material/Subject";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { PDFDocument, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { v4 as uuidv4 } from "uuid";
import type {
  DragState,
  EditorMode,
  FieldType,
  PdfField,
  ResizeHandle,
} from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const MIN_NORM = 0.015;
const HANDLE_PX = 8;
const HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function handleStyle(h: ResizeHandle): CSSProperties {
  const neg = `-${HANDLE_PX / 2}px`;
  const mid = "50%";
  const positions: Record<ResizeHandle, CSSProperties> = {
    nw: { top: neg, left: neg },
    n: { top: neg, left: mid, transform: "translateX(-50%)" },
    ne: { top: neg, right: neg },
    e: { top: mid, right: neg, transform: "translateY(-50%)" },
    se: { bottom: neg, right: neg },
    s: { bottom: neg, left: mid, transform: "translateX(-50%)" },
    sw: { bottom: neg, left: neg },
    w: { top: mid, left: neg, transform: "translateY(-50%)" },
  };
  return positions[h];
}

const CURSORS: Record<ResizeHandle, string> = {
  nw: "nw-resize",
  n: "n-resize",
  ne: "ne-resize",
  e: "e-resize",
  se: "se-resize",
  s: "s-resize",
  sw: "sw-resize",
  w: "w-resize",
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function PdfMergeFieldBuilder() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fields, setFields] = useState<PdfField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>("select");
  const [drawType, setDrawType] = useState<FieldType>("text");
  const [drawPreview, setDrawPreview] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [namingField, setNamingField] = useState<PdfField | null>(null);
  const [pendingName, setPendingName] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef<DragState | null>(null);

  // -- PDF load -----------------------------------------------------------------

  const loadPdf = useCallback(async (file: File) => {
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      setPdfBytes(bytes);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setFields([]);
      setSelectedId(null);
      setMode("select");
    } catch {
      setError(
        "Could not load PDF — it may be corrupted or password-protected.",
      );
    }
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadPdf(f);
      e.target.value = "";
    },
    [loadPdf],
  );

  // -- Page render --------------------------------------------------------------

  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    setIsRendering(true);

    (async () => {
      try {
        renderTaskRef.current?.cancel();
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const scale =
          container.clientWidth / page.getViewport({ scale: 1 }).width;
        const vp = page.getViewport({ scale });
        canvas.width = vp.width;
        canvas.height = vp.height;

        const task = page.render({
          canvasContext: canvas.getContext("2d")!,
          viewport: vp,
        });
        renderTaskRef.current = task;
        await task.promise;
      } catch (e: unknown) {
        if ((e as { name?: string })?.name === "RenderingCancelledException")
          return;
        if (!cancelled) setError("Failed to render page.");
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage]);

  // -- Normalised coordinate helper ---------------------------------------------

  const toNorm = useCallback((clientX: number, clientY: number) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return null;
    return {
      x: clamp((clientX - r.left) / r.width, 0, 1),
      y: clamp((clientY - r.top) / r.height, 0, 1),
    };
  }, []);

  // -- Global mouse listeners (drag + draw release) -----------------------------

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const {
          kind,
          fieldId,
          handle,
          startMX,
          startMY,
          canvasW,
          canvasH,
          orig,
        } = dragRef.current;
        const dx = (e.clientX - startMX) / canvasW;
        const dy = (e.clientY - startMY) / canvasH;

        setFields((prev) =>
          prev.map((f) => {
            if (f.id !== fieldId) return f;

            if (kind === "move") {
              return {
                ...f,
                x: clamp(orig.x + dx, 0, 1 - orig.width),
                y: clamp(orig.y + dy, 0, 1 - orig.height),
              };
            }

            let { x, y, width: w, height: h } = orig;
            if (handle === "e" || handle === "ne" || handle === "se")
              w = Math.max(MIN_NORM, w + dx);
            if (handle === "w" || handle === "nw" || handle === "sw") {
              const nw = Math.max(MIN_NORM, w - dx);
              x += w - nw;
              w = nw;
            }
            if (handle === "s" || handle === "se" || handle === "sw")
              h = Math.max(MIN_NORM, h + dy);
            if (handle === "n" || handle === "ne" || handle === "nw") {
              const nh = Math.max(MIN_NORM, h - dy);
              y += h - nh;
              h = nh;
            }
            return {
              ...f,
              x: clamp(x, 0, 1 - w),
              y: clamp(y, 0, 1 - h),
              width: w,
              height: h,
            };
          }),
        );
        return;
      }

      if (drawStartRef.current) {
        const pos = toNorm(e.clientX, e.clientY);
        if (!pos) return;
        const { x: sx, y: sy } = drawStartRef.current;
        setDrawPreview({
          x: Math.min(sx, pos.x),
          y: Math.min(sy, pos.y),
          w: Math.abs(pos.x - sx),
          h: Math.abs(pos.y - sy),
        });
      }
    };

    const onUp = (e: MouseEvent) => {
      if (dragRef.current) {
        dragRef.current = null;
        return;
      }

      if (drawStartRef.current) {
        const pos = toNorm(e.clientX, e.clientY);
        const start = drawStartRef.current;
        drawStartRef.current = null;
        setDrawPreview(null);

        if (pos) {
          const x = Math.min(start.x, pos.x);
          const y = Math.min(start.y, pos.y);
          const w = Math.abs(pos.x - start.x);
          const h = Math.abs(pos.y - start.y);
          if (w > MIN_NORM && h > MIN_NORM) {
            setNamingField({
              id: uuidv4(),
              name: "",
              type: drawType,
              page: currentPage,
              x,
              y,
              width: w,
              height: h,
            });
            setPendingName("");
          }
        }
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [toNorm, drawType, currentPage]);

  // -- Canvas area mouse-down (start draw or deselect) --------------------------

  const onAreaMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== "draw") {
        setSelectedId(null);
        return;
      }
      e.preventDefault();
      const pos = toNorm(e.clientX, e.clientY);
      if (pos) drawStartRef.current = pos;
    },
    [mode, toNorm],
  );

  // -- Field interaction starters -----------------------------------------------

  const startMove = useCallback(
    (e: React.MouseEvent, fieldId: string) => {
      e.stopPropagation();
      const r = canvasRef.current?.getBoundingClientRect();
      const field = fields.find((f) => f.id === fieldId);
      if (!r || !field) return;
      dragRef.current = {
        kind: "move",
        fieldId,
        startMX: e.clientX,
        startMY: e.clientY,
        canvasW: r.width,
        canvasH: r.height,
        orig: { ...field },
      };
      setSelectedId(fieldId);
    },
    [fields],
  );

  const startResize = useCallback(
    (e: React.MouseEvent, fieldId: string, handle: ResizeHandle) => {
      e.stopPropagation();
      const r = canvasRef.current?.getBoundingClientRect();
      const field = fields.find((f) => f.id === fieldId);
      if (!r || !field) return;
      dragRef.current = {
        kind: "resize",
        fieldId,
        handle,
        startMX: e.clientX,
        startMY: e.clientY,
        canvasW: r.width,
        canvasH: r.height,
        orig: { ...field },
      };
      setSelectedId(fieldId);
    },
    [fields],
  );

  // -- Naming dialog ------------------------------------------------------------

  const confirmName = useCallback(() => {
    if (!namingField || !pendingName.trim()) return;
    const field = { ...namingField, name: pendingName.trim() };
    setFields((prev) => [...prev, field]);
    setSelectedId(field.id);
    setNamingField(null);
    setMode("select");
  }, [namingField, pendingName]);

  // -- Delete -------------------------------------------------------------------

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  // -- Export -------------------------------------------------------------------

  const exportPdf = useCallback(async () => {
    if (!pdfBytes) return;

    setIsExporting(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(pdfBytes);
      const form = doc.getForm();

      const seen = new Map<string, ReturnType<typeof form.createTextField>>();

      for (const field of fields) {
        const page = doc.getPage(field.page - 1);
        const { width: pw, height: ph } = page.getSize();

        // PDF coordinate origin is bottom-left; field.y is from the top
        const x = field.x * pw;
        const y = (1 - field.y - field.height) * ph;
        const w = field.width * pw;
        const h = field.height * ph;

        let tf = seen.get(field.name);
        if (!tf) {
          tf = form.createTextField(field.name);
          if (field.type === "multiline") tf.enableMultiline();
          seen.set(field.name, tf);
        }

        tf.addToPage(page, {
          x,
          y,
          width: w,
          height: h,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      }

      const bytes = await doc.save();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      );
      a.download = "template.pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [pdfBytes, fields]);

  // -- Derived ------------------------------------------------------------------

  const pageFields = fields.filter((f) => f.page === currentPage);
  const selectedField = fields.find((f) => f.id === selectedId) ?? null;

  // -- Upload screen ------------------------------------------------------------

  if (!pdfDoc) {
    return (
      <Container maxWidth="lg" sx={{ pt: { xs: 10, sm: 12 }, pb: 4 }}>
        <Box
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) loadPdf(f);
          }}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 4,
            gap: 2,
          }}
        >
          <UploadFileIcon sx={{ fontSize: 56, color: "text.disabled" }} />
          <Typography variant="h6" color="text.secondary">
            Drop a PDF here
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Choose file
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={onFileChange}
            />
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Container>
    );
  }

  // -- Editor --------------------------------------------------------------------

  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 10, sm: 12 }, pb: 4 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        {/* PDF viewer + toolbar */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
          >
            <Button
              size="small"
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Replace
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={onFileChange}
              />
            </Button>

            <Divider orientation="vertical" flexItem />

            <ToggleButtonGroup
              size="small"
              exclusive
              value={mode === "select" ? "select" : `draw-${drawType}`}
            >
              <ToggleButton value="select" onClick={() => setMode("select")}>
                <Tooltip title="Select / move fields">
                  <NearMeIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="draw-text"
                onClick={() => {
                  setMode("draw");
                  setDrawType("text");
                }}
              >
                <Tooltip title="Draw text field">
                  <TextFieldsIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="draw-multiline"
                onClick={() => {
                  setMode("draw");
                  setDrawType("multiline");
                }}
              >
                <Tooltip title="Draw multiline field">
                  <SubjectIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton
                size="small"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <NavigateBeforeIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ minWidth: 52, textAlign: "center" }}
              >
                {currentPage} / {numPages}
              </Typography>
              <IconButton
                size="small"
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <NavigateNextIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              size="small"
              startIcon={
                isExporting ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <DownloadIcon />
                )
              }
              disabled={isExporting || fields.length === 0}
              onClick={exportPdf}
            >
              Export PDF
            </Button>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 1 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Canvas + field overlays */}
          <Box
            ref={containerRef}
            onMouseDown={onAreaMouseDown}
            sx={{
              position: "relative",
              width: "100%",
              cursor: mode === "draw" ? "crosshair" : "default",
              userSelect: "none",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "#fff",
            }}
          >
            {isRendering && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255,255,255,0.7)",
                  zIndex: 5,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <canvas
              ref={canvasRef}
              style={{ display: "block", width: "100%", height: "auto" }}
            />

            {/* Field boxes */}
            {pageFields.map((field) => {
              const sel = field.id === selectedId;
              const isText = field.type === "text";

              return (
                <Box
                  key={field.id}
                  onMouseDown={(e) => {
                    if (mode === "select") startMove(e, field.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(field.id);
                  }}
                  sx={{
                    position: "absolute",
                    left: `${field.x * 100}%`,
                    top: `${field.y * 100}%`,
                    width: `${field.width * 100}%`,
                    height: `${field.height * 100}%`,
                    boxSizing: "border-box",
                    border: "2px solid",
                    borderColor: sel
                      ? "primary.main"
                      : isText
                        ? "#1976d2cc"
                        : "#2e7d32cc",
                    bgcolor: isText
                      ? "rgba(25,118,210,0.1)"
                      : "rgba(46,125,50,0.1)",
                    borderRadius: "2px",
                    cursor: mode === "select" ? "move" : "default",
                    overflow: "visible",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Field name label */}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 9,
                      lineHeight: 1,
                      px: 0.25,
                      color: isText ? "#0d47a1" : "#1b5e20",
                      bgcolor: isText
                        ? "rgba(227,242,253,0.9)"
                        : "rgba(232,245,233,0.9)",
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      pointerEvents: "none",
                    }}
                  >
                    {field.name || "—"}
                  </Typography>

                  {/* Resize handles, visible when selected */}
                  {sel &&
                    HANDLES.map((h) => (
                      <Box
                        key={h}
                        onMouseDown={(e) => startResize(e, field.id, h)}
                        style={handleStyle(h)}
                        sx={{
                          position: "absolute",
                          width: HANDLE_PX,
                          height: HANDLE_PX,
                          bgcolor: "primary.main",
                          border: "1px solid #fff",
                          borderRadius: "2px",
                          cursor: CURSORS[h],
                          zIndex: 1,
                        }}
                      />
                    ))}
                </Box>
              );
            })}

            {/* Draw preview rectangle */}
            {drawPreview &&
              drawPreview.w > MIN_NORM &&
              drawPreview.h > MIN_NORM && (
                <Box
                  sx={{
                    position: "absolute",
                    left: `${drawPreview.x * 100}%`,
                    top: `${drawPreview.y * 100}%`,
                    width: `${drawPreview.w * 100}%`,
                    height: `${drawPreview.h * 100}%`,
                    border: "2px dashed",
                    borderColor:
                      drawType === "text" ? "primary.main" : "success.main",
                    bgcolor:
                      drawType === "text"
                        ? "rgba(25,118,210,0.06)"
                        : "rgba(46,125,50,0.06)",
                    pointerEvents: "none",
                  }}
                />
              )}
          </Box>
        </Box>

        {/* Sidebar */}
        <Paper
          variant="outlined"
          sx={{
            width: 220,
            flexShrink: 0,
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Typography variant="subtitle2">Fields ({fields.length})</Typography>
          <Divider />

          {/* Selected field editor */}
          {selectedField && (
            <>
              <TextField
                label="Field name"
                size="small"
                fullWidth
                autoFocus
                value={selectedField.name}
                onChange={(e) =>
                  setFields((prev) =>
                    prev.map((f) =>
                      f.id === selectedId ? { ...f, name: e.target.value } : f,
                    ),
                  )
                }
              />
              <Stack direction="row" alignItems="center">
                <Chip
                  label={selectedField.type}
                  size="small"
                  color={selectedField.type === "text" ? "primary" : "success"}
                  sx={{ mr: "auto" }}
                />
                <Tooltip title="Delete field">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteField(selectedField.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Divider />
            </>
          )}

          {/* All-fields list */}
          <Box sx={{ overflow: "auto", flex: 1 }}>
            {fields.length === 0 ? (
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ fontSize: 12 }}
              >
                No fields yet. Draw one using the toolbar above.
              </Typography>
            ) : (
              <Stack spacing={0.5}>
                {fields.map((field) => (
                  <Stack
                    key={field.id}
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    onClick={() => {
                      setSelectedId(field.id);
                      setCurrentPage(field.page);
                    }}
                    sx={{
                      px: 0.75,
                      py: 0.5,
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor:
                        field.id === selectedId
                          ? "action.selected"
                          : "transparent",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        flexShrink: 0,
                        bgcolor:
                          field.type === "text"
                            ? "primary.main"
                            : "success.main",
                      }}
                    />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ flex: 1, fontSize: 11 }}
                    >
                      {field.name || <em style={{ opacity: 0.5 }}>unnamed</em>}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: 10 }}
                    >
                      p{field.page}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ p: 0.25 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteField(field.id);
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>

        {/* Field naming dialog */}
        <Dialog
          open={!!namingField}
          onClose={() => setNamingField(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Name this field</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label="Field name"
              placeholder="e.g. customer_name"
              helperText="Your application should use this name to locate and replace the field value."
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmName();
              }}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNamingField(null)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!pendingName.trim()}
              onClick={confirmName}
            >
              Add Field
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
