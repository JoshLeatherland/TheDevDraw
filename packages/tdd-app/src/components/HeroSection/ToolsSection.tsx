import { Box, Chip, Stack, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export const StyledToolCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "4px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.15)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: "0 0 8px 4px hsla(220, 25%, 80%, 0.15)",
  height: "100%",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 0 16px 8px hsla(220, 25%, 80%, 0.25)",
  },

  ...theme.applyStyles("dark", {
    boxShadow: "0 0 16px 8px hsla(210, 100%, 25%, 0.25)",
    outlineColor: "hsla(220, 20%, 42%, 0.1)",
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));
type Tool = {
  title: string;
  description: string;
  path: string;
  category: "Popular" | "Dev" | "Data" | "Security" | "Assets";
  isNew?: boolean;
};

const tools: Tool[] = [
  {
    title: "Password Generator",
    description: "Generate strong, secure passwords instantly.",
    path: "/tools/password-generator",
    category: "Security",
  },
  {
    title: "JWT Encode / Decode",
    description: "Inspect and generate JSON Web Tokens.",
    path: "/tools/jwt",
    category: "Security",
  },
  {
    title: "JSON Formatter",
    description: "Format, validate and minify JSON.",
    path: "/tools/json-formatter",
    category: "Dev",
  },
  {
    title: "SQL Formatter",
    description: "Format and minify T-SQL queries for readability.",
    path: "/tools/sql-formatter",
    category: "Dev",
  },
  {
    title: "Diff Checker",
    description:
      "Compare two blocks of text and see the differences instantly.",
    path: "/tools/diff-checker",
    category: "Dev",
    isNew: true,
  },
  {
    title: "UUID Generator & Validator",
    description:
      "Generate UUID v4/v7, validate existing UUIDs, and detect versions.",
    path: "/tools/uuid",
    category: "Dev",
    isNew: true,
  },
  {
    title: "SQL Table Generator",
    description:
      "Generate production-ready Microsoft SQL CREATE TABLE scripts.",
    path: "/tools/sql-table",
    category: "Data",
  },
  {
    title: "JSON to C#",
    description: "Convert JSON into strongly typed C# models instantly.",
    path: "/tools/json-to-csharp",
    category: "Data",
    isNew: true,
  },
  {
    title: "C# Model → TypeScript Interface",
    description: "Convert C# DTOs into TypeScript interfaces.",
    path: "/tools/csharp-to-ts",
    category: "Data",
  },
  {
    title: "Base64 Encode / Decode",
    description: "Encode or decode Base64 strings instantly.",
    path: "/tools/base64",
    category: "Data",
  },
  {
    title: "QR Code Generator",
    description: "Create QR codes for links and data.",
    path: "/tools/qr-code-generator",
    category: "Assets",
  },
  {
    title: "Favicon Generator",
    description: "Generate favicon.ico and app icons from PNG or JPG images.",
    path: "/tools/favicon-generator",
    category: "Assets",
    isNew: true,
  },
  {
    title: "Palette Generator",
    description:
      "Generate random color palettes, lock colors, edit HEX, copy, and export as CSS.",
    path: "/tools/palette-generator",
    category: "Assets",
    isNew: true,
  },
];

function ToolsSection() {
  const navigate = useNavigate();

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    acc[tool.category] ??= [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <Box sx={{ mt: 8 }}>
      {Object.entries(grouped).map(([category, tools]) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ mb: 2, display: "block", opacity: 0.7 }}
          >
            {category}
          </Typography>

          <Grid container spacing={3}>
            {tools.map((tool) => (
              <Grid key={tool.title} size={{ xs: 12, sm: 6 }}>
                <StyledToolCard onClick={() => navigate(tool.path)}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                    mb={1}
                  >
                    <Typography variant="h6">{tool.title}</Typography>
                    <Stack direction="row" spacing={1}>
                      {tool.isNew && (
                        <Chip label="NEW" color="success" size="small" />
                      )}
                    </Stack>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </StyledToolCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default ToolsSection;
