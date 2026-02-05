import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export default function TodayScreen() {
  const todayIndex = new Date().getDay();
  const todayName = DAYS[todayIndex];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Today</ThemedText>
        <ThemedText type="title" style={styles.dayText}>
          {todayName}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">here is your workout! have fun!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer2}></ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  stepContainer2: {
    gap: 50,
    marginTop: 10,
    alignItems: "center",
  },
  dayText: {
    color: "#828FB8",
  },
});
