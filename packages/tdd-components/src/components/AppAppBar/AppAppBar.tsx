import { styled, alpha, useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { ColorModeIconDropdown } from "../../components";
import lightLogo from "../../assets/logo-light.png";
import darkLogo from "../../assets/logo-dark.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

function AppAppBar() {
  const [open, setOpen] = useState<boolean>(false);
  const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);

  const { mode, systemMode } = useColorScheme();
  const navigate = useNavigate();

  const resolvedMode = (systemMode || mode) as "light" | "dark";
  const logo = resolvedMode === "dark" ? darkLogo : lightLogo;

  const toolsOpen = Boolean(toolsAnchorEl);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleNavigate = (url: string) => {
    navigate(url);
    setOpen(false);
    setToolsAnchorEl(null);
  };

  const handleToolsClick = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchorEl(event.currentTarget);
  };

  const handleToolsClose = () => {
    setToolsAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box component="img" src={logo} alt="Logo" sx={{ mr: 2 }} />

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handleNavigate("/")}
              >
                Home
              </Button>

              <Button
                variant="text"
                color="info"
                size="small"
                onClick={handleToolsClick}
                endIcon={<ArrowDropDownRoundedIcon />}
                aria-controls={toolsOpen ? "tools-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={toolsOpen ? "true" : undefined}
              >
                Tools
              </Button>

              <Menu
                anchorEl={toolsAnchorEl}
                id="tools-menu"
                open={toolsOpen}
                onClose={handleToolsClose}
                slotProps={{
                  paper: {
                    variant: "outlined",
                    elevation: 0,
                    sx: {
                      my: "4px",
                      minWidth: 220,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => handleNavigate("/tools/password-generator")}
                >
                  Password Generator
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/tools/qr-code-generator")}
                >
                  QR Code Generator
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/tools/jwt")}>
                  JWT Encode / Decode
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/tools/base64")}>
                  Base64 Encode / Decode
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              size="small"
              href="https://github.com/JoshLeatherland/TheDevDraw"
              target="_blank"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>

            <ColorModeIconDropdown />
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton
              color="inherit"
              size="small"
              href="https://github.com/JoshLeatherland/TheDevDraw"
              target="_blank"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>

            <ColorModeIconDropdown size="medium" />

            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  height: "100vh",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "background.default",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem onClick={() => handleNavigate("/")}>Home</MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/tools/password-generator")}
                >
                  Password Generator
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/tools/qr-code-generator")}
                >
                  QR Code Generator
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/tools/jwt")}>
                  JWT Encode / Decode
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/tools/base64")}>
                  Base64 Encode / Decode
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

export default AppAppBar;
