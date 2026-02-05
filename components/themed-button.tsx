import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, StyleSheet, type PressableProps } from "react-native";

type Props = PressableProps & {
  title: string;
};

export function ThemedButton({ title, style, ...props }: Props) {
  const bg = useThemeColor({}, "button");

  return (
    <Pressable
      {...props}
      style={(state) => [
        styles.button,
        { backgroundColor: bg, opacity: state.pressed ? 0.7 : 1 },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <ThemedText>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "200",
  },
});
