export type Tool = {
  title: string;
  description: string;
  path: string;
  category: "Popular" | "Dev" | "Data" | "Security" | "Assets";
  isNew?: boolean;
};
