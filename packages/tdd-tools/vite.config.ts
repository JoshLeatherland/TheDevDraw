import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "./src/index.js",
      name: "tdd-tools",
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.js"),
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@mui/material",
        "@emotion/react",
        "@emotion/styled",
        "@mui/system",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@mui/material": "MaterialUI",
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
          "@mui/system": "MuiSystem",
        },
      },
    },
  },
});
