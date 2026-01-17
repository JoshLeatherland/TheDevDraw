import {
  Checkbox,
  FormControlLabel,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

interface CustomizePasswordProps {
  length: number;
  setLength: (length: number) => void;
  hasUppercase: boolean;
  setHasUppercase: (val: boolean) => void;
  hasLowercase: boolean;
  setHasLowercase: (val: boolean) => void;
  hasNumbers: boolean;
  setHasNumbers: (val: boolean) => void;
  hasSymbols: boolean;
  setHasSymbols: (val: boolean) => void;
}

function CustomizePassword({
  length,
  setLength,
  hasUppercase,
  setHasUppercase,
  hasLowercase,
  setHasLowercase,
  hasNumbers,
  setHasNumbers,
  hasSymbols,
  setHasSymbols,
}: CustomizePasswordProps) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12 }}>
        <Typography gutterBottom>Password Length</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <TextField
              type="number"
              value={length}
              onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
              sx={{ width: "80px" }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Slider
              value={length}
              onChange={(e, value) => setLength(value)}
              min={1}
              max={30}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasUppercase}
              onChange={() => setHasUppercase(!hasUppercase)}
            />
          }
          label="Uppercase"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={hasLowercase}
              onChange={() => setHasLowercase(!hasLowercase)}
            />
          }
          label="Lowercase"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={hasNumbers}
              onChange={() => setHasNumbers(!hasNumbers)}
            />
          }
          label="Numbers"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={hasSymbols}
              onChange={() => setHasSymbols(!hasSymbols)}
            />
          }
          label="Symbols"
        />
      </Grid>
    </Grid>
  );
}

export default CustomizePassword;
