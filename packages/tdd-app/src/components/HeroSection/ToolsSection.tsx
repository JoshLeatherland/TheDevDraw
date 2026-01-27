import { Box, Chip, Stack, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Tool, ToolOptions } from "tdd-components";

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

function ToolsSection() {
  const navigate = useNavigate();

  const tools = ToolOptions as Tool[];

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
