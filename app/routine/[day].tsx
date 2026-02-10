import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import { getDayPlan, setDayPlan } from "@/lib/routineStorage";

import AddIcon from "@/assets/images/add.svg";
import MinusIcon from "@/assets/images/minus.svg";

type Workout = {
  id: string;
  name: string;
  setsReps: string;
  weights: string;
};

const DEFAULT_WORKOUTS: Workout[] = [
  { id: "w1", name: "", setsReps: "", weights: "" },
  { id: "w2", name: "", setsReps: "", weights: "" },
  { id: "w3", name: "", setsReps: "", weights: "" },
  { id: "w4", name: "", setsReps: "", weights: "" },
];

const formatSetsReps = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const match = trimmed.match(/^(\d{1,2})\s*[xX]\s*(\d{1,2})$/);
  if (!match) return null;

  const sets = Number(match[1]);
  const reps = Number(match[2]);

  if (sets <= 0 || reps <= 0 || sets > 99 || reps > 99) return null;

  return `${sets} x ${reps}`;
};

const formatWeightLbs = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const cleaned = trimmed.toLowerCase().replace(/lbs?/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;

  return `${cleaned} lbs`;
};

export default function DayScreen() {
  const bg = useThemeColor({}, "background");
  const MAX_WORKOUTS = 15;

  const { day } = useLocalSearchParams<{ day: string }>();
  const title = day ? day.charAt(0).toUpperCase() + day.slice(1) : "Day";

  const [isRestDay, setIsRestDay] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>(DEFAULT_WORKOUTS);

  useEffect(() => {
    if (!day) return;

    (async () => {
      const key = day.toLowerCase();
      const plan = await getDayPlan(key);

      setIsRestDay(plan.rest);

      if (plan.workouts.length > 0) {
        setWorkouts(
          plan.workouts.map((w) => ({
            id: w.id,
            name: w.name ?? "",
            setsReps: w.setsReps ?? "",
            weights: w.weights ?? "",
          })),
        );
      } else {
        setWorkouts(DEFAULT_WORKOUTS);
      }
    })();
  }, [day]);

  const updateWorkout = (
    index: number,
    key: "name" | "setsReps" | "weights",
    value: string,
  ) => {
    setWorkouts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const removeWorkout = (index: number) => {
    setWorkouts((prev) => prev.filter((_, i) => i !== index));
  };

  const addWorkout = () => {
    setWorkouts((prev) => {
      if (prev.length >= MAX_WORKOUTS) {
        Alert.alert(
          "Chill 😭",
          "You don’t need that many workouts for one day!",
        );
        return prev;
      }
      return [
        ...prev,
        { id: `w${Date.now()}`, name: "", setsReps: "", weights: "" },
      ];
    });
  };

  const onClear = async () => {
    if (!day) return;
    const key = day.toLowerCase();

    Alert.alert("Clear this day?", "This will delete everything you entered.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          setIsRestDay(false);
          setWorkouts(DEFAULT_WORKOUTS);

          await setDayPlan(key, { rest: false, workouts: [] });
        },
      },
    ]);
  };

  const onSave = async () => {
    if (!day) return;
    const key = day.toLowerCase();

    if (isRestDay) {
      await setDayPlan(key, { rest: true, workouts: [] });

      router.replace({
        pathname: "/(tabs)/routine",
        params: { highlight: key, refresh: String(Date.now()) },
      });

      return;
    }

    // validate formats
    for (let i = 0; i < workouts.length; i++) {
      const s = workouts[i].setsReps;
      const w = workouts[i].weights;

      if (s && formatSetsReps(s) === null) {
        Alert.alert(
          "Fix this",
          `Workout #${i + 1}: sets x reps should be like 9 x 8`,
        );
        return;
      }
      if (w && formatWeightLbs(w) === null) {
        Alert.alert(
          "Fix this",
          `Workout #${i + 1}: weight should be a number like 10`,
        );
        return;
      }
    }

    // remove totally empty workouts
    const cleaned = workouts.filter((x) => {
      const hasName = x.name.trim() !== "";
      const hasSetsReps = x.setsReps.trim() !== "";
      const hasWeights = x.weights.trim() !== "";
      return hasName || hasSetsReps || hasWeights;
    });

    await setDayPlan(key, { rest: false, workouts: cleaned });

    const shouldHighlight = cleaned.length > 0;

    router.replace({
      pathname: "/(tabs)/routine",
      params: {
        refresh: String(Date.now()),
        ...(shouldHighlight ? { highlight: key } : {}),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: bg }]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* top-right actions */}

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Chosen Day</ThemedText>
          <ThemedText type="title" style={styles.dayText}>
            {title}
          </ThemedText>
        </ThemedView>

        <ThemedText type="subtitle" style={styles.subtitle}>
          {isRestDay
            ? "set as rest day, then hit save!"
            : "input your workout and then hit save!"}
        </ThemedText>

        {isRestDay ? (
          <ThemedText type="subtitle" style={styles.restMessage}>
            (This day will be saved as a rest day — no workouts.)
          </ThemedText>
        ) : (
          <>
            <ThemedView style={styles.workoutList}>
              {workouts.map((w, index) => (
                <ThemedView key={w.id} style={styles.workoutBlock}>
                  <ThemedView style={styles.leftCol}>
                    <Pressable
                      onPress={() => removeWorkout(index)}
                      style={styles.iconBtn}
                    >
                      <MinusIcon width={28} height={28} />
                    </Pressable>

                    <TextInput
                      value={w.name}
                      onChangeText={(t) => updateWorkout(index, "name", t)}
                      placeholder={`Workout #${index + 1}`}
                      placeholderTextColor="#7a7a7a"
                      style={[styles.input, { width: 140 }]}
                    />
                  </ThemedView>

                  <ThemedView style={styles.rightCol}>
                    <TextInput
                      value={w.setsReps}
                      onChangeText={(t) => updateWorkout(index, "setsReps", t)}
                      onBlur={() => {
                        const formatted = formatSetsReps(w.setsReps);
                        if (formatted === null) {
                          Alert.alert(
                            "Format",
                            "Sets x reps should look like: 9 x 8",
                          );
                          return;
                        }
                        updateWorkout(index, "setsReps", formatted);
                      }}
                      placeholder="(sets x reps)"
                      placeholderTextColor="#7a7a7a"
                      style={styles.input}
                    />

                    <TextInput
                      value={w.weights}
                      onChangeText={(t) => updateWorkout(index, "weights", t)}
                      onBlur={() => {
                        const formatted = formatWeightLbs(w.weights);
                        if (formatted === null) {
                          Alert.alert(
                            "Format",
                            "Weight should be a number like 10 or 15.5",
                          );
                          return;
                        }
                        updateWorkout(index, "weights", formatted);
                      }}
                      placeholder="weights"
                      placeholderTextColor="#7a7a7a"
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>

            {/* add / clear / rest day row */}
            {!isRestDay ? (
              <ThemedView style={styles.actionRow}>
                <Pressable onPress={onClear} hitSlop={12}>
                  <ThemedText style={styles.clearText}>clear</ThemedText>
                </Pressable>
                <Pressable onPress={addWorkout} style={styles.addButton}>
                  <AddIcon width={36} height={36} />
                </Pressable>
                <Pressable
                  onPress={() => setIsRestDay(true)}
                  style={styles.restBtn}
                  hitSlop={12}
                >
                  <ThemedText style={styles.restText}>rest day</ThemedText>
                </Pressable>
              </ThemedView>
            ) : null}
          </>
        )}

        <ThemedButton title="Save" onPress={onSave} style={styles.saveButton} />
        {isRestDay && (
          <Pressable
            onPress={() => setIsRestDay(false)}
            style={styles.undoBtn}
            hitSlop={12}
          >
            <ThemedText style={styles.undoText}>undo</ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },

  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: "center",
  },

  topActions: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  clearBtn: {},
  clearText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2b2b2b",
    textDecorationLine: "underline",
    left: 90,
    top: 10,
  },

  restBtn: {
    borderWidth: 1.5,
    borderColor: "#2b2b2b",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    right: 50,
    top: 10,
  },
  restBtnActive: {
    borderColor: "#828FB8",
    backgroundColor: "rgba(130, 143, 184, 0.10)",
  },
  restText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2b2b2b",
  },
  restTextActive: {
    color: "#828FB8",
  },

  titleContainer: {
    gap: 10,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 36,
  },

  dayText: {
    color: "#828FB8",
    textAlign: "center",
  },

  subtitle: {
    marginBottom: 18,
    textAlign: "center",
    paddingHorizontal: 18,
  },

  restMessage: {
    textAlign: "center",
    paddingHorizontal: 18,
    color: "#828FB8",
    fontWeight: "600",
    marginTop: 140,
  },

  workoutList: {
    width: "100%",
    gap: 26,
    marginTop: 8,
    paddingHorizontal: 18,
  },

  workoutBlock: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },

  rightCol: {
    width: 170,
    gap: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#2b2b2b",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "white",
    color: "#000",
  },

  iconBtn: {
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    marginTop: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    left: 20,
  },

  saveButton: {
    minWidth: 180,
    marginTop: 18,
  },
  undoBtn: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  undoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2b2b2b",
    textDecorationLine: "underline",
  },
  movingActions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 6,
  },
  actionRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 18,
    marginBottom: 6,
  },
});
