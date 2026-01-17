import { Box, LinearProgress, Typography } from "@mui/material";

interface PasswordStrengthIndicatorProps {
  strength: "Weak" | "Moderate" | "Strong" | string;
}

function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  const strengthValue =
    strength === "Weak" ? 33 : strength === "Moderate" ? 66 : 100;

  const strengthColor =
    strength === "Weak"
      ? "error"
      : strength === "Moderate"
      ? "warning"
      : "success";

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Password Strength: {strength}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={strengthValue}
        color={strengthColor}
      />
    </Box>
  );
}

export default PasswordStrengthIndicator;
