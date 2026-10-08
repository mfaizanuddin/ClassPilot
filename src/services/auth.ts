import AsyncStorage from "@react-native-async-storage/async-storage";

export type ClassPilotUser = {
  username: string;
  password: string;
  name: string;
  subject: string;
};

const USER_KEY = "classpilot_user";
const SESSION_KEY = "classpilot_session";

export async function getUser(): Promise<ClassPilotUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createAccount(
  username: string,
  password: string
): Promise<boolean> {
  const existing = await getUser();

  if (existing) {
    throw new Error("An account already exists on this device.");
  }

  const user: ClassPilotUser = {
    username: username.trim(),
    password,
    name: "",
    subject: "",
  };

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

  return true;
}

export async function loginUser(
  username: string,
  password: string
): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  if (
    user.username.trim().toLowerCase() !== username.trim().toLowerCase() ||
    user.password !== password
  ) {
    return false;
  }

  await AsyncStorage.setItem(SESSION_KEY, "true");

  return true;
}

export async function saveProfile(
  name: string,
  subject: string
): Promise<void> {
  const user = await getUser();

  if (!user) {
    throw new Error("No account found.");
  }

  const updatedUser: ClassPilotUser = {
    ...user,
    name: name.trim(),
    subject: subject.trim(),
  };

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function isLoggedIn(): Promise<boolean> {
  const session = await AsyncStorage.getItem(SESSION_KEY);
  return session === "true";
}
