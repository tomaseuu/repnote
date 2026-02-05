import AsyncStorage from "@react-native-async-storage/async-storage";

// saves checkmarks for a specific calendar day (YYYY-MM-DD) + day key (monday, tuesday...)
const KEY = "repnote:checks:v1";

type ChecksMap = Record<string, string[]>;
// key format: "YYYY-MM-DD:monday" -> ["workoutId1", "workoutId2"]

function getLocalDateKey(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function makeKey(dateKey: string, dayKey: string) {
  return `${dateKey}:${dayKey}`;
}

export async function getCheckedIdsForToday(dayKey: string) {
  const dateKey = getLocalDateKey();
  const raw = await AsyncStorage.getItem(KEY);
  const map: ChecksMap = raw ? JSON.parse(raw) : {};
  return map[makeKey(dateKey, dayKey)] ?? [];
}

export async function setCheckedIdsForToday(dayKey: string, ids: string[]) {
  const dateKey = getLocalDateKey();
  const raw = await AsyncStorage.getItem(KEY);
  const map: ChecksMap = raw ? JSON.parse(raw) : {};
  map[makeKey(dateKey, dayKey)] = ids;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

export async function toggleCheckedForToday(dayKey: string, workoutId: string) {
  const current = await getCheckedIdsForToday(dayKey);
  const set = new Set(current);

  if (set.has(workoutId)) set.delete(workoutId);
  else set.add(workoutId);

  const next = Array.from(set);
  await setCheckedIdsForToday(dayKey, next);
  return next;
}
