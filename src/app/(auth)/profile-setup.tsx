import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getUser, saveProfile } from "../../services/auth";

export default function ProfileSetupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const user = await getUser();

    if (user) {
      setName(user.name || "");
      setSubject(user.subject || "");
    }
  }

  const handleFinish = async () => {
    setError("");

    if (!name.trim() || !subject.trim()) {
      setError("Please complete your profile.");
      return;
    }

    try {
      setLoading(true);

      await saveProfile(name, subject);

      router.replace("/teacher-dashboard");
    } catch (e: any) {
      setError(e?.message || "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#050B18", "#08152C", "#07101F"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressRow}>
            <View style={styles.progressActive} />
            <View style={styles.progressActive} />
            <View style={styles.progressInactive} />
          </View>

          <View style={styles.iconCircle}>
            <Text style={styles.icon}>?</Text>
          </View>

          <Text style={styles.eyebrow}>PROFILE SETUP</Text>

          <Text style={styles.title}>
            Tell us about yourself
          </Text>

          <Text style={styles.subtitle}>
            ClassPilot will use this information to personalize your teaching
            workspace.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>YOUR NAME</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Faizan Uddin"
              placeholderTextColor="#64748B"
              style={styles.input}
            />

            <Text style={styles.label}>PRIMARY SUBJECT</Text>

            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g. Computer Science"
              placeholderTextColor="#64748B"
              style={styles.input}
            />

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleFinish}
              disabled={loading}
            >
              <LinearGradient
                colors={["#1677FF", "#00B8FF"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Saving..." : "Save Profile"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            You can update these details later from your profile.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  progressRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 34,
  },

  progressActive: {
    height: 4,
    flex: 1,
    borderRadius: 4,
    backgroundColor: "#22AFFF",
  },

  progressInactive: {
    height: 4,
    flex: 1,
    borderRadius: 4,
    backgroundColor: "#18304F",
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#0D2344",
    borderWidth: 1,
    borderColor: "#1B7CFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  icon: {
    color: "#38BDF8",
    fontSize: 30,
  },

  eyebrow: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 9,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "rgba(12, 28, 52, 0.92)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#17375E",
    padding: 20,
  },

  label: {
    color: "#7DD3FC",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  input: {
    height: 53,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#23476E",
    backgroundColor: "#071426",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 19,
  },

  error: {
    color: "#FF7B7B",
    fontSize: 13,
    marginBottom: 14,
  },

  button: {
    height: 54,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  footer: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});
