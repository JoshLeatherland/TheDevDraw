import { Meta, StoryFn } from "@storybook/react";
import Button from "./Button";
import { ArrowForward, CheckCircle } from "@mui/icons-material";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "contained", "outlined"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "error", "warning", "info"],
    },
    thickBorder: {
      control: "boolean",
    },
    sx: {
      control: "object",
    },
  },
  tags: ["autodocs"],
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Click Me",
  variant: "contained",
};

export const SmallButton = Template.bind({});
SmallButton.args = {
  children: "Small Button",
  size: "small",
  variant: "contained",
};

export const LargeButton = Template.bind({});
LargeButton.args = {
  children: "Large Button",
  size: "large",
  variant: "contained",
};

export const ContainedButton = Template.bind({});
ContainedButton.args = {
  children: "Contained Button",
  variant: "contained",
};

export const OutlinedButton = Template.bind({});
OutlinedButton.args = {
  children: "Outlined Button",
  variant: "outlined",
};

export const ButtonWithIcon = Template.bind({});
ButtonWithIcon.args = {
  children: "Button with Icon",
  startIcon: <ArrowForward />,
  variant: "contained",
};

export const ButtonWithEndIcon = Template.bind({});
ButtonWithEndIcon.args = {
  children: "Button with End Icon",
  endIcon: <CheckCircle />,
  variant: "contained",
};

export const ButtonWithPadding = Template.bind({});
ButtonWithPadding.args = {
  children: "Button with Padding",
  sx: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  variant: "contained",
};

export const ButtonWithThickBorder = Template.bind({});
ButtonWithThickBorder.args = {
  children: "Thick Border Button",
  thickBorder: true,
  sx: {
    borderWidth: "3px",
  },
  variant: "contained",
};
