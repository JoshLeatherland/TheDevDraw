import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import { ReactNode } from "react";

interface ButtonProps extends MUIButtonProps {
  children: ReactNode;
  paddingTop?: number;
  paddingBottom?: number;
  thickBorder?: boolean;
}

function Button({ children, sx, ...props }: ButtonProps) {
  return (
    <MUIButton
      {...props}
      sx={{
        ...sx,
      }}
    >
      {children}
    </MUIButton>
  );
}

export default Button;
