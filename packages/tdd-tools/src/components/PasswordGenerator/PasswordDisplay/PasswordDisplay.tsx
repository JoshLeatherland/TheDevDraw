import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface PasswordDisplayProps {
  password: string;
  onCopy: () => void;
  onGenerate: () => void;
}

function PasswordDisplay({
  password,
  onCopy,
  onGenerate,
}: PasswordDisplayProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      gap="10px"
    >
      <Typography
        variant="h6"
        style={{
          wordBreak: "break-word",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {password || "Generate a Password"}
      </Typography>

      <Box display="flex" gap="10px">
        <Tooltip title="Copy to Clipboard">
          <IconButton color="primary" onClick={onCopy} disabled={!password}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Generate New Password">
          <IconButton color="primary" onClick={onGenerate}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default PasswordDisplay;
