import { AppTheme } from "tdd-components";
import { alpha, Box, CssBaseline } from "@mui/material";
import { Footer, HeroSection, PrivacyPolicy } from "./components";
import { Route, Routes } from "react-router-dom";
import {
  Base64Tool,
  CSharpToTsTool,
  DiffCheckerTool,
  FaviconGeneratorTool,
  JsonFormatterTool,
  JsonToCSharpTool,
  JwtTool,
  PasswordGenerator,
  QRCodeGenerator,
  SqlFormatterTool,
  SqlTableGenerator,
  UuidTool,
} from "tdd-tools";
import { AppAppBar } from "tdd-components";

function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <Box sx={{ display: "flex" }}>
        <AppAppBar />

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            minHeight: "100vh",
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Box
            sx={(theme) => ({
              height: "100%",
              margin: "0 auto",
              borderRadius: 3,
              p: 0,
              width: "100%",
              backgroundRepeat: "no-repeat",

              backgroundImage:
                "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
              }),
            })}
          >
            <Routes>
              <Route path="/" element={<HeroSection />} />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              <Route path="/tools">
                <Route
                  path="password-generator"
                  element={<PasswordGenerator />}
                />

                <Route path="qr-code-generator" element={<QRCodeGenerator />} />

                <Route path="jwt" element={<JwtTool />} />

                <Route path="base64" element={<Base64Tool />} />

                <Route path="sql-table" element={<SqlTableGenerator />} />

                <Route path="csharp-to-ts" element={<CSharpToTsTool />} />

                <Route path="json-formatter" element={<JsonFormatterTool />} />

                <Route path="sql-formatter" element={<SqlFormatterTool />} />

                <Route path="json-to-csharp" element={<JsonToCSharpTool />} />

                <Route
                  path="/tools/diff-checker"
                  element={<DiffCheckerTool />}
                />

                <Route
                  path="/tools/favicon-generator"
                  element={<FaviconGeneratorTool />}
                />

                <Route path="/tools/uuid" element={<UuidTool />} />
              </Route>
            </Routes>

            <Footer />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default App;
