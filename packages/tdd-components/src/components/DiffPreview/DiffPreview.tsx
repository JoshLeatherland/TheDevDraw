import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  useColorScheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DiffEditor } from "@monaco-editor/react";

type DiffPreviewProps = {
  title?: string;
  original: string;
  modified: string;
  language?: string;
  height?: number | string;
  onChangeOriginal?: (value: string) => void;
  onChangeModified?: (value: string) => void;
};

function DiffPreview({
  title,
  original,
  modified,
  language = "plaintext",
  height = 400,
  onChangeOriginal,
  onChangeModified,
}: DiffPreviewProps) {
  const [copied, setCopied] = useState(false);

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = (systemMode || mode) as "light" | "dark";
  const editorTheme = resolvedMode === "light" ? "light" : "vs-dark";

  const handleCopyUnified = async () => {
    const diffText = `--- Original\n${original}\n\n+++ Modified\n${modified}`;
    await navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
      {title && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1 }}
        >
          <Typography fontWeight={600}>{title}</Typography>

          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton size="small" onClick={handleCopyUnified}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <DiffEditor
        height={height}
        original={original}
        modified={modified}
        language={language}
        theme={editorTheme}
        onMount={(editor) => {
          editor.getOriginalEditor().onDidChangeModelContent(() => {
            onChangeOriginal?.(editor.getOriginalEditor().getValue() ?? "");
          });

          editor.getModifiedEditor().onDidChangeModelContent(() => {
            onChangeModified?.(editor.getModifiedEditor().getValue() ?? "");
          });
        }}
        options={{
          renderSideBySide: true,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          originalEditable: true,
          readOnly: false,
        }}
      />
    </Box>
  );
}

export default DiffPreview;
