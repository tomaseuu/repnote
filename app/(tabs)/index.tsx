import RedPanda from "@/assets/images/red-panda.svg";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to</ThemedText>
        <ThemedText type="title">RepNote</ThemedText>
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
        <ThemedText type="subtitle">be consistent</ThemedText>
        <ThemedText type="subtitle">be discipline</ThemedText>
        <ThemedText type="subtitle">be patient</ThemedText>
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
    marginTop: 40,
    alignItems: "center",
  },
  RedPanda: {
    width: 214,
    height: 214,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  stepContainer2: {
    gap: 30,
    marginTop: 10,
    alignItems: "center",
  },
});
