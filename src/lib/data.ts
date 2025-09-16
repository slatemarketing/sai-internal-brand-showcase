// lib/data.ts

export interface LogoVariant {
  color: string;
  name: string;
  theme: "light" | "dark";
}

export interface LogoCategory {
  title: string;
  folder: string;
  slug: string;
}

export interface LogoConfig {
  basePath: string;
  version: string;
  categories: LogoCategory[];
  variants: LogoVariant[];
}

export const logoConfig: LogoConfig = {
  basePath: "https://cdn.slateai.org/Logos/FINAL",
  version: "v1",
  categories: [
    { title: "Centered", folder: "centered", slug: "centered" },
    { title: "Profile", folder: "profile", slug: "profile" },
    { title: "Text AI", folder: "text-ai", slug: "text" },
  ],
  variants: [
    { color: "black-gemini", name: "Black", theme: "light" },
    { color: "obsidian-gemini", name: "Obsidian", theme: "light" },
    { color: "ash-gemini", name: "Ash", theme: "dark" },
    { color: "juniper-gemini", name: "Juniper", theme: "dark" },
    { color: "mineral-gemini", name: "Mineral", theme: "dark" },
    { color: "stratum-gemini", name: "Stratum", theme: "dark" },
  ],
};

export const paletteLinks = {
  download:
    "https://cdn.slateai.org/Color%20Palettes/SlateAI%20Color%20Palette%20v0.2.png",
  external:
    "https://www.figma.com/color-palette-generator/?colors=232B2B-5F6F7C-82998A-6D94C3-F0F4F4", // Update with your actual external link
};

export const primaryColors = [
  "#232B2B",
  "#5F6F7C",
  "#82998A",
  "#6D94C3",
  "#F0F4F4",
];

export const fullPalette = [
  ["#C2E4E4", "#9FBBBB", "#7D9494", "#5D6F6F", "#3F4C4C", "#232B2B", "#0D1212"],
  ["#D7E0E8", "#A4BACD", "#7F94A5", "#5F6F7C", "#414C55", "#242C32", "#0D1115"],
  ["#CAE9D5", "#A4C1AE", "#82998A", "#617368", "#435047", "#282F29", "#0E120F"],
  ["#D6E0F0", "#9FB9DE", "#6D94C3", "#516F93", "#364C66", "#1E2C3C", "#0A111B"],
  ["#F0F4F4", "#C5CCCC", "#9FA5A5", "#7B8080", "#585C5C", "#383B3B", "#1B1C1C"],
  ["#D7DFDF", "#B0B7B7", "#8B9191", "#686C6C", "#474A4A", "#282A2A", "#101111"],
];
