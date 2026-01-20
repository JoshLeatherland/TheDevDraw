import Editor from "@monaco-editor/react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  useColorScheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

type CodePreviewProps = {
  title?: string;
  value: string;
  language?: string;
  height?: number | string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export default function CodePreview({
  title,
  value,
  language = "json",
  height = 300,
  readOnly = true,
  onChange,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const { mode, systemMode } = useColorScheme();

  const resolvedMode = (systemMode || mode) as "light" | "dark";

  const editorTheme = resolvedMode === "light" ? "light" : "vs-dark";

  return (
    <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
      {title && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1,
          }}
        >
          <Typography fontWeight={600}>{title}</Typography>

          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Editor
        height={height}
        language={language}
        value={value}
        theme={editorTheme}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          lineNumbers: "on",
          renderLineHighlight: "line",
        }}
      />
    </Box>
  );
}
