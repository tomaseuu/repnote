import AsyncStorage from "@react-native-async-storage/async-storage";

export type Workout = {
  id: string;
  name?: string;
  setsReps: string;
  weights: string;
};

export type DayPlan = {
  rest: boolean; // true = rest day
  workouts: Workout[]; // empty if rest day
};

/* the entire week of workouts */
/* 
   Key = day ("monday", "tuesday", etc) 
   Value = day plan (rest day OR list of workouts)
*/
export type RoutineMap = Record<string, DayPlan>;

// storage key on the phone
const KEY = "repnote:routine:v2";

// get everything saved
export async function getRoutine(): Promise<RoutineMap> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as RoutineMap) : {};
}

// get plan for one day
export async function getDayPlan(day: string): Promise<DayPlan> {
  const routine = await getRoutine();

  // default = not rest day, no workouts
  return routine[day] ?? { rest: false, workouts: [] };
}

// save plan for one day
export async function setDayPlan(day: string, plan: DayPlan) {
  const routine = await getRoutine();
  routine[day] = plan;
  await AsyncStorage.setItem(KEY, JSON.stringify(routine));
}

// clear one day
export async function clearDay(day: string) {
  const routine = await getRoutine();
  delete routine[day];
  await AsyncStorage.setItem(KEY, JSON.stringify(routine));
}
