/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const Palette = {
  main01: "#A8B89A",
  main02: "#F29B7F",
  main03: "#7D9AAE",
  main04: "#F6E6DC",
  main05: "#FFF8F3",

  gray01: "#3A3A3A",
  gray02: "#6F6762",
  gray03: "#A59A93",
  gray04: "#E8DDD5",

  background: "#FFF8F3",
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
    text: Palette.main05,
    background: "#3A3A3A",
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
