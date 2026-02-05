import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function RoutineScreen() {
  const bg = useThemeColor({}, "background");

  return (
    <ScrollView
      style={{ backgroundColor: bg }}
      contentContainerStyle={styles.containerContent}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Create your</ThemedText>
        <ThemedText type="title">Routine</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          click on the day to edit and save
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer2}>
        {DAYS.map((day) => (
          <Pressable
            key={day}
            onPress={() => router.push(`/routine/${day.toLowerCase()}`)}
          >
            {({ pressed }) => (
              <ThemedText
                type="subtitle"
                style={pressed && styles.dayTextPressed}
              >
                {day}
              </ThemedText>
            )}
          </Pressable>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerContent: {
    paddingBottom: 60,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  stepContainer: {
    gap: 10,
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  stepContainer2: {
    gap: 50,
    marginTop: 10,
    alignItems: "center",
  },
  dayTextPressed: {
    color: "#828FB8",
    fontWeight: "600",
  },
});
