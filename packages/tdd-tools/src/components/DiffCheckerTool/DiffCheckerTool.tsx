import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { DiffPreview } from "tdd-components";

function DiffCheckerTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

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
              Diff Checker
            </Typography>

            <Typography color="text.secondary" mb={3}>
              Compare two blocks of text and see the differences
            </Typography>

            <DiffPreview
              title="Compare"
              original={left}
              modified={right}
              language="plaintext"
              height={500}
              onChangeOriginal={setLeft}
              onChangeModified={setRight}
            />

            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setLeft("");
                  setRight("");
                }}
              >
                Clear
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  setLeft(right);
                  setRight(left);
                }}
              >
                Swap
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default DiffCheckerTool;
