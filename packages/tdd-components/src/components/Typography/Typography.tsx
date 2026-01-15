import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from "@mui/material";
import { ReactNode } from "react";

export interface TypographyProps extends MuiTypographyProps {
  children: ReactNode;
}

function Typography({ children, ...props }: TypographyProps) {
  return <MuiTypography {...props}>{children}</MuiTypography>;
}

export default Typography;
