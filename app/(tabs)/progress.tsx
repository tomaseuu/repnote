// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { useThemeColor } from "@/hooks/use-theme-color";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "expo-router";
// import { useCallback, useMemo, useState } from "react";
// import {
//   Alert,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   View,
// } from "react-native";

// const STORAGE_KEY = "repnote_progress_v1";

// //
// const pad2 = (n: number) => String(n).padStart(2, "0");
// const toISODate = (d: Date) =>
//   `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// const startOfWeekMon = (d: Date) => {
//   const copy = new Date(d);
//   const day = copy.getDay();
//   const diff = day === 0 ? -6 : 1 - day;
//   copy.setDate(copy.getDate() + diff);
//   copy.setHours(0, 0, 0, 0);
//   return copy;
// };

// const addDays = (d: Date, n: number) => {
//   const copy = new Date(d);
//   copy.setDate(copy.getDate() + n);
//   return copy;
// };

// type ProgressData = {
//   goals: {
//     workoutsPerWeek: number | null;
//     calorieGoal: number | null;
//   };
//   gymDays: Record<string, boolean>;
// };

// const DEFAULT_DATA: ProgressData = {
//   goals: { workoutsPerWeek: 4, calorieGoal: 2200 },
//   gymDays: {},
// };

// export default function ProgressScreen() {
//   const bg = useThemeColor({}, "background");

//   const [data, setData] = useState<ProgressData>(DEFAULT_DATA);
//   const [loading, setLoading] = useState(true);

//   const today = useMemo(() => new Date(), []);
//   const weekStart = useMemo(() => startOfWeekMon(new Date()), []);
//   const weekDays = useMemo(
//     () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
//     [weekStart],
//   );

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const raw = await AsyncStorage.getItem(STORAGE_KEY);
//       if (!raw) {
//         setData(DEFAULT_DATA);
//       } else {
//         setData(JSON.parse(raw));
//       }
//     } catch {
//       setData(DEFAULT_DATA);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const save = useCallback(async (next: ProgressData) => {
//     setData(next);
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
//     } catch {}
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       load();
//     }, [load]),
//   );

//   const weekCount = useMemo(() => {
//     let c = 0;
//     for (const d of weekDays) {
//       const key = toISODate(d);
//       if (data.gymDays[key]) c++;
//     }
//     return c;
//   }, [data.gymDays, weekDays]);

//   const workoutsGoal = data.goals.workoutsPerWeek ?? 0;
//   const consistencyPct =
//     workoutsGoal > 0
//       ? Math.min(100, Math.round((weekCount / workoutsGoal) * 100))
//       : 0;

//   const streak = useMemo(() => {
//     let s = 0;
//     let cur = new Date();
//     cur.setHours(0, 0, 0, 0);

//     while (true) {
//       const key = toISODate(cur);
//       if (!data.gymDays[key]) break;
//       s++;
//       cur = addDays(cur, -1);
//     }
//     return s;
//   }, [data.gymDays]);

//   const toggleDay = async (dateKey: string) => {
//     const next: ProgressData = {
//       ...data,
//       gymDays: {
//         ...data.gymDays,
//         [dateKey]: !data.gymDays[dateKey],
//       },
//     };

//     if (!next.gymDays[dateKey]) delete next.gymDays[dateKey];
//     await save(next);
//   };

//   const updateGoal = async (
//     key: "workoutsPerWeek" | "calorieGoal",
//     value: string,
//   ) => {
//     const cleaned = value.trim();
//     if (cleaned === "") {
//       const next = {
//         ...data,
//         goals: { ...data.goals, [key]: null },
//       };
//       await save(next);
//       return;
//     }
//     if (!/^\d+$/.test(cleaned)) return;
//     const num = Number(cleaned);
//     const next = {
//       ...data,
//       goals: { ...data.goals, [key]: num },
//     };
//     await save(next);
//   };

//   const resetWeek = async () => {
//     Alert.alert("Reset", "Clear all gym check-ins?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Reset",
//         style: "destructive",
//         onPress: async () => {
//           await save({ ...data, gymDays: {} });
//         },
//       },
//     ]);
//   };

//   if (loading) {
//     return <ThemedView style={[styles.full, { backgroundColor: bg }]} />;
//   }

//   return (
//     <ScrollView
//       style={{ flex: 1, backgroundColor: bg }}
//       contentContainerStyle={styles.container}
//     >
//       {/* Title */}
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Progress</ThemedText>
//         <ThemedText type="title" style={styles.accent}>
//           Check
//         </ThemedText>
//       </ThemedView>

//       <ThemedText type="subtitle" style={styles.sub}>
//         set your goals + tap the calendar when you go gym
//       </ThemedText>

//       {/* Goals */}
//       <ThemedView style={styles.card}>
//         <ThemedText style={styles.cardTitle}>Goals</ThemedText>

//         <View style={styles.goalRow}>
//           <ThemedText type="subtitle" style={styles.goalLabel}>
//             workouts / week
//           </ThemedText>
//           <TextInput
//             value={data.goals.workoutsPerWeek?.toString() ?? ""}
//             onChangeText={(t) => updateGoal("workoutsPerWeek", t)}
//             placeholder="4"
//             placeholderTextColor="#7a7a7a"
//             keyboardType="number-pad"
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.goalRow}>
//           <ThemedText type="subtitle" style={styles.goalLabel}>
//             calorie goal
//           </ThemedText>
//           <TextInput
//             value={data.goals.calorieGoal?.toString() ?? ""}
//             onChangeText={(t) => updateGoal("calorieGoal", t)}
//             placeholder="2200"
//             placeholderTextColor="#7a7a7a"
//             keyboardType="number-pad"
//             style={styles.input}
//           />
//         </View>
//       </ThemedView>

//       {/* Stats */}
//       <ThemedView style={styles.card}>
//         <ThemedText style={styles.cardTitle}>This week</ThemedText>

//         <View style={styles.statsRow}>
//           <View style={styles.statBox}>
//             <ThemedText style={styles.statBig}>{weekCount}</ThemedText>
//             <ThemedText style={styles.statSmall}>workouts</ThemedText>
//           </View>

//           <View style={styles.statBox}>
//             <ThemedText style={styles.statBig}>{streak}</ThemedText>
//             <ThemedText style={styles.statSmall}>streak</ThemedText>
//           </View>

//           <View style={styles.statBox}>
//             <ThemedText style={styles.statBig}>{consistencyPct}%</ThemedText>
//             <ThemedText style={styles.statSmall}>consistent</ThemedText>
//           </View>
//         </View>
//       </ThemedView>

//       {/* Calendar (this week) */}
//       <ThemedView style={styles.card}>
//         <View style={styles.calendarHeader}>
//           <ThemedText style={styles.cardTitle}>Calendar</ThemedText>
//           <Pressable onPress={resetWeek} hitSlop={10}>
//             <ThemedText style={styles.resetText}>reset</ThemedText>
//           </Pressable>
//         </View>

//         <View style={styles.weekRow}>
//           {weekDays.map((d) => {
//             const key = toISODate(d);
//             const checked = !!data.gymDays[key];

//             const isToday = toISODate(d) === toISODate(new Date());
//             const label = ["M", "T", "W", "T", "F", "S", "S"][
//               weekDays.indexOf(d)
//             ];
//             const dayNum = d.getDate();

//             return (
//               <Pressable
//                 key={key}
//                 onPress={() => toggleDay(key)}
//                 style={[
//                   styles.dayCell,
//                   checked && styles.dayCellChecked,
//                   isToday && styles.dayCellToday,
//                 ]}
//               >
//                 <ThemedText
//                   style={[styles.dayLabel, checked && styles.dayLabelChecked]}
//                 >
//                   {label}
//                 </ThemedText>
//                 <ThemedText
//                   style={[styles.dayNum, checked && styles.dayNumChecked]}
//                 >
//                   {dayNum}
//                 </ThemedText>
//               </Pressable>
//             );
//           })}
//         </View>

//         <ThemedText style={styles.hint}>tap a day to mark gym</ThemedText>
//       </ThemedView>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   full: { flex: 1 },

//   container: {
//     paddingBottom: 80,
//     paddingTop: 20,
//     alignItems: "center",
//   },

//   titleContainer: {
//     flexDirection: "row",
//     gap: 10,
//     alignItems: "center",
//     paddingTop: 70,
//   },

//   accent: {
//     color: "#828FB8",
//   },

//   sub: {
//     marginTop: 16,
//     textAlign: "center",
//     paddingHorizontal: 24,
//   },

//   card: {
//     width: "92%",
//     marginTop: 18,
//     borderWidth: 1,
//     borderColor: "#2b2b2b",
//     padding: 16,
//   },

//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#09100D",
//     marginBottom: 10,
//   },

//   goalRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 10,
//     gap: 12,
//   },

//   goalLabel: {
//     fontWeight: "600",
//   },

//   input: {
//     width: 110,
//     borderWidth: 1,
//     borderColor: "#2b2b2b",
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     backgroundColor: "white",
//     color: "#000",
//     textAlign: "center",
//   },

//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },

//   statBox: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#2b2b2b",
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   statBig: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#09100D",
//   },

//   statSmall: {
//     marginTop: 6,
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#7E89B8",
//   },

//   calendarHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   resetText: {
//     color: "#828FB8",
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   weekRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//     marginTop: 10,
//   },

//   dayCell: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#2b2b2b",
//     paddingVertical: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   dayCellChecked: {
//     backgroundColor: "#2b2b2b",
//   },

//   dayCellToday: {
//     borderColor: "#828FB8",
//     borderWidth: 2,
//   },

//   dayLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#09100D",
//   },

//   dayNum: {
//     marginTop: 6,
//     fontSize: 18,
//     fontWeight: "900",
//     color: "#09100D",
//   },

//   dayLabelChecked: {
//     color: "white",
//   },

//   dayNumChecked: {
//     color: "white",
//   },

//   hint: {
//     marginTop: 12,
//     color: "#828FB8",
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });
