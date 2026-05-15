/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const Palette = {
  main01: "#FF7548",
  main02: "#FF9F80",
  main03: "#FFD4C6",
  main04: "#FFEAE4",
  main05: "#FFF1ED",

  gray01: "#0D0D0D",
  gray02: "#5A5857",
  gray03: "#A7A5A4",
  gray04: "#D6D6D6",

  background: "#F2F4F6",
};

export const Colors = {
  light: {
    ...Palette,
    text: Palette.gray01,
    background: Palette.background,
    tint: Palette.main01,
    icon: Palette.gray03,
    tabIconDefault: Palette.gray03,
    tabIconSelected: Palette.main01,
  },
  dark: {
    ...Palette,
    text: "#ECEDEE",
    background: "#151718",
    tint: Palette.main01,
    icon: Palette.gray03,
    tabIconDefault: Palette.gray04,
    tabIconSelected: Palette.main01,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
