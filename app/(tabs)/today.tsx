import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

import { DayPlan, getDayPlan } from "@/lib/routineStorage";
import {
  getCheckedIdsForToday,
  toggleCheckedForToday,
} from "@/lib/todayChecks";

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
  const bg = useThemeColor({}, "background");

  const todayIndex = new Date().getDay();
  const todayName = DAYS[todayIndex];
  const todayKey = useMemo(() => todayName.toLowerCase(), [todayName]);

  const [plan, setPlan] = useState<DayPlan>({ rest: false, workouts: [] });
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const p = await getDayPlan(todayKey);
        setPlan(p);

        const ids = await getCheckedIdsForToday(todayKey);
        setCheckedIds(ids);
      })();
    }, [todayKey]),
  );

  const checkedSet = useMemo(() => new Set(checkedIds), [checkedIds]);
  const hasWorkouts = plan.workouts.length > 0;

  const onToggle = async (workoutId: string) => {
    const next = await toggleCheckedForToday(todayKey, workoutId);
    setCheckedIds(next);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bg }}
      contentContainerStyle={styles.container}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Today</ThemedText>
        <ThemedText type="title" style={styles.dayText}>
          {todayName}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        {!hasWorkouts ? (
          <ThemedText type="subtitle">
            you have not input any workouts for the day!
          </ThemedText>
        ) : (
          <ThemedText type="subtitle">
            here is your workout! have fun!
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer2}>
        {!hasWorkouts
          ? null
          : plan.workouts.map((w) => {
              const checked = checkedSet.has(w.id);
              const name = w.name?.trim() ? w.name : "Workout";
              const sets = w.setsReps ? ` - (${w.setsReps})` : "";
              const weight = w.weights ? ` : ${w.weights}` : "";

              return (
                <Pressable
                  key={w.id}
                  onPress={() => onToggle(w.id)}
                  style={styles.row}
                >
                  <ThemedView
                    style={[styles.box, checked && styles.boxChecked]}
                  >
                    {checked ? (
                      <ThemedText style={styles.check}>✓</ThemedText>
                    ) : null}
                  </ThemedView>

                  <ThemedText type="subtitle" style={styles.workoutText}>
                    {name}
                    {sets}
                    {weight}
                  </ThemedText>
                </Pressable>
              );
            })}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    gap: 28,
    marginTop: 10,
    alignItems: "flex-start",
    paddingHorizontal: 30,
  },
  dayText: {
    color: "#828FB8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 30,
    marginLeft: 30,
  },
  box: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: "#2b2b2b",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  boxChecked: {
    backgroundColor: "#2b2b2b",
  },
  check: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18,
  },
  workoutText: {
    fontWeight: "600",
  },
});
