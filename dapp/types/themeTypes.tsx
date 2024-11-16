type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange" | "Pink" | "Purple";

interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}