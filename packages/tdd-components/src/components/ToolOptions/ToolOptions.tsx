import { Tool } from "../../types";

const toolOptions: Tool[] = [
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
    title: "Image to Base64",
    description: "Convert images into Base64 strings for API testing.",
    path: "/tools/image-to-base64",
    category: "Data",
    isNew: true,
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

export default toolOptions;
