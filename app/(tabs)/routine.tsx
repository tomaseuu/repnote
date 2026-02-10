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
  const { highlight, refresh } = useLocalSearchParams<{
    highlight?: string;
    refresh?: string;
  }>();

  const [routine, setRoutine] = useState<RoutineMap>({});

  const load = async () => {
    const r = await getRoutine();
    setRoutine(r);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [refresh]),
  );

  const completedDays = useMemo(() => {
    const set = new Set<string>();

    for (const d of DAYS) {
      const key = d.toLowerCase();
      const plan = routine[key];
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
      {/* title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Create your</ThemedText>
        <ThemedText type="title">Routine</ThemedText>
      </ThemedView>

      {/* subtitle */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          click on the day to edit and save
        </ThemedText>
      </ThemedView>

      {/* days */}
      <ThemedView style={styles.stepContainer2}>
        {DAYS.map((day) => {
          const key = day.toLowerCase();
          const isCompleted = completedDays.has(key);
          const isHighlighted = highlight === key && isCompleted;

          return (
            <Pressable key={day} onPress={() => router.push(`/routine/${key}`)}>
              {({ pressed }) => (
                <ThemedView
                  style={[
                    styles.dayPill,
                    (pressed || isCompleted || isHighlighted) &&
                      styles.dayPillActive,
                  ]}
                >
                  <ThemedText
                    type="subtitle"
                    style={[
                      styles.dayText,
                      (pressed || isCompleted || isHighlighted) &&
                        styles.dayTextActive,
                    ]}
                  >
                    {day}
                  </ThemedText>
                </ThemedView>
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
    gap: 22,
    marginTop: 10,
    alignItems: "center",
  },

  /* ---- day pill ---- */

  dayPill: {
    width: 280,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#2b2b2b",
    borderRadius: 22,
    backgroundColor: "transparent",
  },

  dayPillActive: {
    borderColor: "#828FB8",
    backgroundColor: "rgba(130, 143, 184, 0.08)",
  },

  dayText: {
    fontWeight: "600",
    color: "#09100D",
  },

  dayTextActive: {
    color: "#828FB8",
  },
});
