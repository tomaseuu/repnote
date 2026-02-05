import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

import { getRoutine, RoutineMap } from "@/lib/routineStorage";

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

  const { highlight } = useLocalSearchParams<{ highlight?: string }>();

  const [routine, setRoutine] = useState<RoutineMap>({});

  const load = async () => {
    const r = await getRoutine();
    setRoutine(r);
  };

  // reload when you come back from saving
  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  // which days are "done" (either workouts exist OR rest day was saved)
  const completedDays = useMemo(() => {
    const set = new Set<string>();

    for (const d of DAYS) {
      const key = d.toLowerCase();
      const plan = routine[key]; // DayPlan | undefined

      // ✅ if they saved this day as rest OR they have workouts, it should stay highlighted
      if (plan && (plan.rest || plan.workouts.length > 0)) {
        set.add(key);
      }
    }

    return set;
  }, [routine]);

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
        {DAYS.map((day) => {
          const key = day.toLowerCase();
          const isCompleted = completedDays.has(key);
          const isHighlighted = highlight === key; // optional: last-edited day

          return (
            <Pressable key={day} onPress={() => router.push(`/routine/${key}`)}>
              {({ pressed }) => (
                <ThemedText
                  type="subtitle"
                  style={[
                    pressed && styles.dayTextPressed,
                    (isCompleted || isHighlighted) && styles.dayTextPressed,
                  ]}
                >
                  {day}
                </ThemedText>
              )}
            </Pressable>
          );
        })}
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
