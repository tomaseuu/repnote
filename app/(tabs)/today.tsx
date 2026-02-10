import RedPanda from "@/assets/images/red-panda.svg";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

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

  // "checklist" or "congrats"
  const [mode, setMode] = useState<"checklist" | "congrats">("checklist");

  // confetti trigger
  const [confettiKey, setConfettiKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        setLoading(true);

        const p = await getDayPlan(todayKey);
        const ids = await getCheckedIdsForToday(todayKey);

        if (!alive) return;

        setPlan(p);
        setCheckedIds(ids);

        const done = p.workouts.length > 0 && ids.length === p.workouts.length;
        setMode(done ? "congrats" : "checklist");

        setLoading(false);
      })();

      return () => {
        alive = false;
      };
    }, [todayKey]),
  );

  const checkedSet = useMemo(() => new Set(checkedIds), [checkedIds]);
  const hasWorkouts = plan.workouts.length > 0;
  const isRest = plan.rest;

  const allDone = hasWorkouts && checkedIds.length === plan.workouts.length;

  const onToggle = async (workoutId: string) => {
    const next = await toggleCheckedForToday(todayKey, workoutId);
    setCheckedIds(next);

    const total = plan.workouts.length;
    const nowDone = total > 0 && next.length === total;

    // if they JUST completed the last one → confetti + switch view
    if (nowDone && !allDone) {
      setConfettiKey((k) => k + 1);
      setMode("congrats");
    }
  };

  if (loading) {
    return <ThemedView style={[styles.fullScreen, { backgroundColor: bg }]} />;
  }

  // congrats view
  if (mode === "congrats" && allDone) {
    return (
      <ThemedView style={[styles.fullScreen, { backgroundColor: bg }]}>
        {/* confetti */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiCannon
            key={confettiKey}
            count={140}
            origin={{ x: 0, y: 0 }}
            fadeOut
            fallSpeed={260}
            explosionSpeed={420}
          />
          <ConfettiCannon
            key={`r-${confettiKey}`}
            count={140}
            origin={{ x: 390, y: 0 }}
            fadeOut
            fallSpeed={260}
            explosionSpeed={420}
          />
        </View>

        {/* back button
        <Pressable
          onPress={() => setMode("checklist")}
          style={styles.backBtn}
          hitSlop={10}
        >
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable> */}

        {/* centered content */}
        <View style={styles.congratsCenter}>
          <ThemedText style={styles.woohoo}>WOOHOO!!!</ThemedText>

          <ThemedText style={styles.subtitle}>
            You completed your{"\n"}workout for
          </ThemedText>

          <ThemedText style={styles.day}>{todayName}!</ThemedText>

          <View style={styles.pandaWrap}>
            <RedPanda />
          </View>
        </View>
      </ThemedView>
    );
  }

  // checklist
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
        {isRest ? (
          <ThemedText type="subtitle" style={styles.emptyStateText}>
            today is a rest day!
          </ThemedText>
        ) : !hasWorkouts ? (
          <ThemedText type="subtitle" style={styles.emptyStateText}>
            you have not input any workouts for the day!
          </ThemedText>
        ) : (
          <ThemedText type="subtitle">
            here is your workout! have fun!
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer2}>
        {isRest || !hasWorkouts
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

  // congrats
  fullScreen: { flex: 1 },

  backBtn: {
    position: "absolute",
    top: 60,
    left: 18,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2b2b2b",
  },

  congratsCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  woohoo: {
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 48,
    marginBottom: 12,
    color: "#09100D",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 32,
    textAlign: "center",
    lineHeight: 38,
    fontWeight: "500",
    color: "#09100D",
    marginBottom: 8,
  },
  day: {
    fontSize: 40,
    marginTop: 4,
    lineHeight: 50,
    color: "#7E89B8",
    fontWeight: "800",
  },
  pandaWrap: {
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 36,
    marginTop: 200,
  },
});
