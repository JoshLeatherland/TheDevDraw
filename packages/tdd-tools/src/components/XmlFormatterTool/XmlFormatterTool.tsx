import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { CodePreview } from "tdd-components";

function escAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function serializeNode(node: Node, indent: string, depth: number): string {
  const pad = indent.repeat(depth);

  switch (node.nodeType) {
    case Node.TEXT_NODE: {
      const t = node.textContent?.trim() ?? "";
      return t ? `${pad}${escText(t)}` : "";
    }
    case Node.COMMENT_NODE:
      return `${pad}<!--${node.textContent}-->`;
    case Node.CDATA_SECTION_NODE:
      return `${pad}<![CDATA[${node.textContent}]]>`;
    case Node.PROCESSING_INSTRUCTION_NODE: {
      const pi = node as ProcessingInstruction;
      return `${pad}<?${pi.target}${pi.data ? " " + pi.data : ""}?>`;
    }
    case Node.ELEMENT_NODE: {
      const el = node as Element;
      const attrs = Array.from(el.attributes)
        .map((a) => ` ${a.name}="${escAttr(a.value)}"`)
        .join("");
      const childLines = Array.from(el.childNodes)
        .map((c) => serializeNode(c, indent, depth + 1))
        .filter((s) => s !== "");
      if (childLines.length === 0) return `${pad}<${el.tagName}${attrs}/>`;
      if (
        childLines.length === 1 &&
        el.childNodes.length === 1 &&
        el.firstChild!.nodeType === Node.TEXT_NODE
      ) {
        return `${pad}<${el.tagName}${attrs}>${escText(el.firstChild!.textContent?.trim() ?? "")}</${el.tagName}>`;
      }
      return `${pad}<${el.tagName}${attrs}>\n${childLines.join("\n")}\n${pad}</${el.tagName}>`;
    }
    case Node.DOCUMENT_NODE:
      return Array.from(node.childNodes)
        .map((c) => serializeNode(c, indent, 0))
        .filter((s) => s !== "")
        .join("\n");
    default:
      return "";
  }
}

function minifyNode(node: Node): string {
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return escText(node.textContent?.trim() ?? "");
    case Node.COMMENT_NODE:
      return "";
    case Node.CDATA_SECTION_NODE:
      return `<![CDATA[${node.textContent}]]>`;
    case Node.PROCESSING_INSTRUCTION_NODE: {
      const pi = node as ProcessingInstruction;
      return `<?${pi.target}${pi.data ? " " + pi.data : ""}?>`;
    }
    case Node.ELEMENT_NODE: {
      const el = node as Element;
      const attrs = Array.from(el.attributes)
        .map((a) => ` ${a.name}="${escAttr(a.value)}"`)
        .join("");
      const inner = Array.from(el.childNodes).map(minifyNode).join("");
      return inner ? `<${el.tagName}${attrs}>${inner}</${el.tagName}>` : `<${el.tagName}${attrs}/>`;
    }
    case Node.DOCUMENT_NODE:
      return Array.from(node.childNodes).map(minifyNode).join("");
    default:
      return "";
  }
}

function parseXml(raw: string): { doc: Document | null; error: string | null } {
  if (!raw.trim()) return { doc: null, error: null };
  const doc = new DOMParser().parseFromString(raw, "application/xml");
  const errNode = doc.querySelector("parsererror");
  if (errNode) {
    const msg = errNode.textContent?.replace(/\s+/g, " ").trim() ?? "Invalid XML";
    return { doc: null, error: msg };
  }
  return { doc, error: null };
}

function XmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [input, output]);

  const formatXml = () => {
    const { doc, error: err } = parseXml(input);
    if (err) { setError(err); setOutput(""); return; }
    if (!doc) return;
    const hasDecl = /^\s*<\?xml[\s?]/i.test(input);
    const decl = '<?xml version="1.0" encoding="UTF-8"?>';
    const body = serializeNode(doc, "  ", 0);
    setOutput(hasDecl ? `${decl}\n${body}` : body);
    setError(null);
  };

  const minifyXml = () => {
    const { doc, error: err } = parseXml(input);
    if (err) { setError(err); setOutput(""); return; }
    if (!doc) return;
    const hasDecl = /^\s*<\?xml[\s?]/i.test(input);
    const decl = '<?xml version="1.0" encoding="UTF-8"?>';
    const body = minifyNode(doc);
    setOutput(hasDecl ? `${decl}${body}` : body);
    setError(null);
  };

  const validateXml = () => {
    const { error: err } = parseXml(input);
    if (err) { setError(err); return; }
    setError(null);
    setMessage("This is valid XML.");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={600} mb={1}>
              XML Formatter
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Format, validate and minify XML instantly
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}

            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <CodePreview
                      title="Input XML"
                      value={input}
                      readOnly={false}
                      onChange={(val) => setInput(val)}
                      language="xml"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <CodePreview
                      title="Output"
                      value={output}
                      language="xml"
                      height={400}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3} flexWrap="wrap">
              <Button variant="contained" onClick={formatXml}>
                Format
              </Button>
              <Button variant="outlined" onClick={minifyXml}>
                Minify
              </Button>
              <Button variant="outlined" onClick={validateXml}>
                Validate
              </Button>
              <Button variant="outlined" onClick={clearAll}>
                Clear
              </Button>
              <Button variant="outlined" onClick={copyOutput} disabled={!output}>
                Copy Output
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Copied to clipboard"
      />
    </Box>
  );
}

export default XmlFormatterTool;
