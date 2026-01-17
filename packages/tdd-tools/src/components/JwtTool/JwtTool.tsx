import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { jwtDecode } from "jwt-decode";

type JwtParts = {
  header: any;
  payload: any;
  signature: string;
};

function JwtTool() {
  const [token, setToken] = useState("");
  const [headerJson, setHeaderJson] = useState(
    JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
  );
  const [payloadJson, setPayloadJson] = useState(
    JSON.stringify(
      { sub: "1234567890", name: "John Doe", iat: 1516239022 },
      null,
      2
    )
  );

  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setDecoded(null);
      setError(null);
      return;
    }

    try {
      const [headerB64, payloadB64, signature] = token.split(".");
      const header = JSON.parse(atob(headerB64));
      const payload = jwtDecode(token);

      setDecoded({ header, payload, signature });
      setError(null);
    } catch {
      setError("Invalid JWT format");
      setDecoded(null);
    }
  }, [token]);

  const encodeJwt = () => {
    try {
      const header = JSON.parse(headerJson);
      const payload = JSON.parse(payloadJson);

      const base64url = (obj: any) =>
        btoa(JSON.stringify(obj))
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");

      const encodedHeader = base64url(header);
      const encodedPayload = base64url(payload);

      setToken(`${encodedHeader}.${encodedPayload}.`);
      setError(null);
    } catch {
      setError("Invalid JSON in header or payload");
    }
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  const multilineProps = {
    multiline: true,
    minRows: 5,
    fullWidth: true,
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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={600}>
                JWT Encoder / Decoder
              </Typography>

              <TextField
                variant="filled"
                label="JWT Token"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                {...multilineProps}
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography fontWeight={600}>Header</Typography>

                        <TextField
                          variant="filled"
                          value={
                            decoded
                              ? JSON.stringify(decoded.header, null, 2)
                              : headerJson
                          }
                          onChange={(e) => setHeaderJson(e.target.value)}
                          {...multilineProps}
                        />

                        {decoded && (
                          <IconButton
                            onClick={() =>
                              copy(JSON.stringify(decoded.header, null, 2))
                            }
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography fontWeight={600}>Payload</Typography>

                        <TextField
                          variant="filled"
                          value={
                            decoded
                              ? JSON.stringify(decoded.payload, null, 2)
                              : payloadJson
                          }
                          onChange={(e) => setPayloadJson(e.target.value)}
                          {...multilineProps}
                        />

                        {decoded && (
                          <IconButton
                            onClick={() =>
                              copy(JSON.stringify(decoded.payload, null, 2))
                            }
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography fontWeight={600}>Signature</Typography>

                        <TextField
                          variant="filled"
                          value={decoded?.signature || ""}
                          disabled
                          {...multilineProps}
                        />

                        {decoded && (
                          <IconButton onClick={() => copy(decoded.signature)}>
                            <ContentCopyIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Typography fontWeight={600}>
                      JWT Encoder (Unsigned)
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          variant="filled"
                          label="Header JSON"
                          value={headerJson}
                          onChange={(e) => setHeaderJson(e.target.value)}
                          {...multilineProps}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          variant="filled"
                          label="Payload JSON"
                          value={payloadJson}
                          onChange={(e) => setPayloadJson(e.target.value)}
                          {...multilineProps}
                        />
                      </Grid>
                    </Grid>

                    <Button variant="contained" onClick={encodeJwt}>
                      Encode JWT (Unsigned)
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Alert severity="info">
                This tool does not sign tokens. It only encodes and decodes JWTs
                locally.
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default JwtTool;
