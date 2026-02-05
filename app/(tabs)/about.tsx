import RedPanda from "@/assets/images/red-panda.svg";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          a simple way to begin your gym journey
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.imageContainer}>
        <RedPanda />
      </ThemedView>

      <ThemedView style={styles.stepContainer2}>
        <ThemedText type="subtitle" style={styles.centerText}>
          RepNote is a simple workout planner I made for myself.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.centerText}>
          Most gym apps felt overcomplicated, and I just wanted a fast way to
          access my weekly workouts and see what I am doing today!
        </ThemedText>

        <ThemedText type="subtitle" style={styles.centerText}>
          No social features. No charts. Just the basics to stay consistent at
          the gym.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.centerText}>
          - Thomas Le
        </ThemedText>
      </ThemedView>

      <ThemedButton
        title="Create/Edit Workout"
        onPress={() => router.push("/routine")}
      />
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
    marginTop: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  stepContainer2: {
    gap: 20,
    marginTop: -20,
    alignItems: "center",
    paddingHorizontal: 24,
    maxWidth: 380,
    alignSelf: "center",
  },
  centerText: {
    textAlign: "center",
  },
});
