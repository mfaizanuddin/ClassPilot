import AsyncStorage from "@react-native-async-storage/async-storage";

export type ClassSchedule = {
  id: string;
  day: string;
  subject: string;
  section: string;
  room: string;
  startTime: string;
  endTime: string;
};

export type SyllabusFile = {
  id: string;
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
};

const CLASSES_KEY = "classpilot_classes";
const SYLLABI_KEY = "classpilot_syllabi";

export async function getClasses(): Promise<ClassSchedule[]> {
  const raw = await AsyncStorage.getItem(CLASSES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveClasses(classes: ClassSchedule[]) {
  await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
}

export async function addClass(item: ClassSchedule) {
  const classes = await getClasses();
  classes.push(item);
  await saveClasses(classes);
}

export async function updateClass(item: ClassSchedule) {
  const classes = await getClasses();
  const updated = classes.map((c) => (c.id === item.id ? item : c));
  await saveClasses(updated);
}

export async function deleteClass(id: string) {
  const classes = await getClasses();
  await saveClasses(classes.filter((c) => c.id !== id));
}

export async function getSyllabi(): Promise<SyllabusFile[]> {
  const raw = await AsyncStorage.getItem(SYLLABI_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSyllabus(item: SyllabusFile) {
  const syllabi = await getSyllabi();
  syllabi.unshift(item);
  await AsyncStorage.setItem(SYLLABI_KEY, JSON.stringify(syllabi));
}

export async function deleteSyllabus(id: string) {
  const syllabi = await getSyllabi();
  await AsyncStorage.setItem(
    SYLLABI_KEY,
    JSON.stringify(syllabi.filter((s) => s.id !== id))
  );
}

