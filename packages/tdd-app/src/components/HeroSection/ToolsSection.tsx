import { Box, styled } from "@mui/material";
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

const tools = [
  {
    title: "Password Generator",
    description: "Generate strong, secure passwords instantly.",
    path: "/tools/password-generator",
  },
  {
    title: "QR Code Generator",
    description: "Create QR codes for links and data.",
    path: "/tools/qr-code-generator",
  },
  {
    title: "JWT Encode / Decode",
    description: "Inspect and generate JSON Web Tokens.",
    path: "/tools/jwt",
  },
  {
    title: "Base64 Encode / Decode",
    description: "Convert text and files to Base64 and back.",
    path: "/tools/base64",
  },
  {
    title: "SQL Table Generator",
    description:
      "Generate production-ready Microsoft SQL CREATE TABLE scripts.",
    path: "/tools/sql-table",
  },
  {
    title: "C# Model → TypeScript Interface",
    description: "Convert C# DTOs and models into TypeScript interfaces.",
    path: "/tools/csharp-to-ts",
  },
];

function ToolsSection() {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3} sx={{ mt: 8 }}>
      {tools.map((tool) => (
        <Grid size={{ xs: 12, sm: 6 }} key={tool.title}>
          <StyledToolCard onClick={() => navigate(tool.path)}>
            <Typography variant="h6" gutterBottom>
              {tool.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {tool.description}
            </Typography>
          </StyledToolCard>
        </Grid>
      ))}
    </Grid>
  );
}

export default ToolsSection;
