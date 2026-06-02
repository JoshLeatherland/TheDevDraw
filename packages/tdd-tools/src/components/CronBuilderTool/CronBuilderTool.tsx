import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { parseExpression } from "cron-parser";
import cronstrue from "cronstrue";

type Preset = { label: string; expr: string };

const PRESETS: Preset[] = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Every 15 min", expr: "*/15 * * * *" },
  { label: "Every 6 hours", expr: "0 */6 * * *" },
  { label: "Daily midnight", expr: "0 0 * * *" },
  { label: "Daily noon", expr: "0 12 * * *" },
  { label: "Weekdays 9 am", expr: "0 9 * * 1-5" },
  { label: "Mon at 9 am", expr: "0 9 * * 1" },
  { label: "1st of month", expr: "0 0 1 * *" },
  { label: "Every Sunday", expr: "0 0 * * 0" },
];

type FieldDef = {
  label: string;
  hint: string;
  examples: string;
  index: number;
};

const FIELDS: FieldDef[] = [
  {
    label: "Minute",
    hint: "0 – 59",
    examples: "*, 0, 30, */15, 0-30",
    index: 0,
  },
  { label: "Hour", hint: "0 – 23", examples: "*, 0, 9, 9-17, */6", index: 1 },
  { label: "Day", hint: "1 – 31", examples: "*, 1, 15, L", index: 2 },
  {
    label: "Month",
    hint: "1–12 or JAN–DEC",
    examples: "*, 1, 6-12, */3",
    index: 3,
  },
  {
    label: "Weekday",
    hint: "0–7 (0 & 7 = Sun)",
    examples: "*, 1-5, 1, MON-FRI",
    index: 4,
  },
];

const SYNTAX_ROWS = [
  { token: "*", meaning: "Any / every value" },
  { token: "*/n", meaning: "Every n units  (e.g. */15 = every 15 min)" },
  { token: "n-m", meaning: "Range from n to m  (e.g. 1-5 = Mon–Fri)" },
  { token: "n,m", meaning: "List of specific values  (e.g. 0,30)" },
  { token: "n-m/s", meaning: "Range with step  (e.g. 0-12/3)" },
];

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function computeNextRuns(expr: string, count = 8): Date[] {
  const interval = parseExpression(expr, { utc: false });
  return Array.from({ length: count }, () => interval.next().toDate());
}

function getDescription(expr: string): string {
  return cronstrue.toString(expr, { throwExceptionOnParseError: true });
}

export default function CronBuilderTool() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Re-evaluate whenever the expression changes
  useEffect(() => {
    try {
      setNextRuns(computeNextRuns(expr));
      setParseError(null);
    } catch {
      setNextRuns([]);
      setParseError("Invalid expression");
    }

    try {
      setDescription(getDescription(expr));
    } catch {
      setDescription("");
    }
  }, [expr]);

  // Update a single positional field without touching the rest
  const updateField = useCallback(
    (index: number, value: string) => {
      const parts = expr.split(" ");
      while (parts.length < 5) parts.push("*");
      parts[index] = value || "*";
      setExpr(parts.join(" "));
    },
    [expr],
  );

  const copyExpr = useCallback(async () => {
    await navigator.clipboard.writeText(expr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [expr]);

  // Derive the individual field values (guard against malformed input)
  const parts = expr.split(" ");
  const safeParts = FIELDS.map((f) => parts[f.index] ?? "*");
  const isValid = parseError === null;

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 13, sm: 14 }, pb: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Cron Expression Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build, validate and understand cron expressions. See the next
            scheduled run times instantly.
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            Presets
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mt: 0.75,
            }}
          >
            {PRESETS.map((p) => (
              <Chip
                key={p.expr}
                label={p.label}
                size="small"
                clickable
                variant={expr === p.expr ? "filled" : "outlined"}
                color={expr === p.expr ? "primary" : "default"}
                onClick={() => setExpr(p.expr)}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            Expression
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mt: 0.75 }}
          >
            <TextField
              fullWidth
              variant="filled"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              error={!isValid}
              slotProps={{
                input: {
                  sx: {
                    fontFamily: "monospace",
                    fontSize: { xs: 18, sm: 22 },
                    letterSpacing: 2,
                    py: 1.5,
                  },
                },
              }}
            />
            <Tooltip title={copied ? "Copied!" : "Copy expression"}>
              <IconButton onClick={copyExpr} size="small">
                {copied ? (
                  <CheckIcon fontSize="small" color="success" />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          <Box sx={{ mt: 1, minHeight: 28 }}>
            {isValid && description && (
              <Chip
                icon={<ScheduleIcon />}
                label={description}
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            {!isValid && (
              <Alert severity="error" sx={{ py: 0 }}>
                {parseError}
              </Alert>
            )}
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            Fields
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(5, 1fr)" },
              gap: 1.5,
              mt: 0.75,
            }}
          >
            {FIELDS.map((field) => (
              <Stack key={field.label} spacing={0.25}>
                <Typography variant="caption" fontWeight={600}>
                  {field.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: 10 }}
                >
                  {field.hint}
                </Typography>
                <TextField
                  variant="filled"
                  size="small"
                  value={safeParts[field.index]}
                  onChange={(e) => updateField(field.index, e.target.value)}
                  slotProps={{
                    input: { sx: { fontFamily: "monospace", fontSize: 13 } },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: 10, lineHeight: 1.3 }}
                >
                  e.g. {field.examples}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>

        {isValid && nextRuns.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              Next {nextRuns.length} scheduled runs
            </Typography>
            <Paper variant="outlined" sx={{ mt: 0.75, overflow: "hidden" }}>
              {nextRuns.map((date, i) => (
                <Box key={i}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ px: 2, py: 1 }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ minWidth: 18, fontVariantNumeric: "tabular-nums" }}
                    >
                      {i + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontSize: 13 }}
                    >
                      {DATE_FMT.format(date)}
                    </Typography>
                  </Stack>
                  {i < nextRuns.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            Syntax reference
          </Typography>
          <Paper variant="outlined" sx={{ mt: 0.75, overflow: "hidden" }}>
            {SYNTAX_ROWS.map((row, i) => (
              <Box key={row.token}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ px: 2, py: 0.75 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      minWidth: 60,
                      flexShrink: 0,
                    }}
                  >
                    {row.token}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.meaning}
                  </Typography>
                </Stack>
                {i < SYNTAX_ROWS.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}
