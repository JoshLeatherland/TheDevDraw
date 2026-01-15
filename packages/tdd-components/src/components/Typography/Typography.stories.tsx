import { Meta, StoryFn } from "@storybook/react";
import Typography from "./Typography";

export default {
  title: "Typography",
  component: Typography,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "subtitle1",
          "subtitle2",
          "body1",
          "body2",
          "caption",
          "overline",
          "button",
        ],
      },
    },
    color: {
      control: {
        type: "select",
        options: [
          "initial",
          "primary",
          "secondary",
          "error",
          "textPrimary",
          "textSecondary",
        ],
      },
    },
    fontWeight: {
      control: {
        type: "select",
        options: [300, 400, 600, 700],
      },
    },
  },
  tags: ["autodocs"],
} as Meta<typeof Typography>;

const Template: StoryFn<typeof Typography> = (args) => <Typography {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "This is default typography.",
  variant: "body1",
};

export const Heading1 = Template.bind({});
Heading1.args = {
  children: "Heading Example",
  variant: "h1",
  fontWeight: 600,
};

export const Heading2 = Template.bind({});
Heading2.args = {
  children: "Heading Example",
  variant: "h2",
  fontWeight: 600,
};

export const Heading3 = Template.bind({});
Heading3.args = {
  children: "Heading Example",
  variant: "h3",
  fontWeight: 600,
};

export const Heading4 = Template.bind({});
Heading4.args = {
  children: "Heading Example",
  variant: "h4",
  fontWeight: 600,
};

export const Heading5 = Template.bind({});
Heading5.args = {
  children: "Heading Example",
  variant: "h5",
  fontWeight: 600,
};

export const Heading6 = Template.bind({});
Heading6.args = {
  children: "Heading Example",
  variant: "h6",
  fontWeight: 600,
};

export const Subtitle1 = Template.bind({});
Subtitle1.args = {
  children: "This is a subtitle1.",
  variant: "subtitle1",
  color: "textSecondary",
};

export const Subtitle2 = Template.bind({});
Subtitle2.args = {
  children: "This is a subtitle2.",
  variant: "subtitle2",
  color: "textSecondary",
};

export const Body1 = Template.bind({});
Body1.args = {
  children: "This is body1 text.",
  variant: "body1",
};

export const Body2 = Template.bind({});
Body2.args = {
  children: "This is body2 text.",
  variant: "body2",
};

export const Caption = Template.bind({});
Caption.args = {
  children: "This is a caption.",
  variant: "caption",
  color: "secondary",
};

export const Overline = Template.bind({});
Overline.args = {
  children: "OVERLINE TEXT",
  variant: "overline",
};

export const ButtonText = Template.bind({});
ButtonText.args = {
  children: "BUTTON TEXT",
  variant: "button",
};
