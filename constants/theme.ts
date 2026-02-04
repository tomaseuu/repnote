/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#A8BBCD";
const tintColorDark = "#627fa7";

export const Colors = {
  light: {
    text: "#09100D",
    background: "#F2F8F5",
    button: "#5FA48B",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#eef6f4",
    background: "#0d1715",
    button: "#a0cac7",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = {
  regular: "Jost_400Regular",
  medium: "Jost_500Medium",
  semibold: "Jost_600SemiBold",
  bold: "Jost_700Bold",
};
