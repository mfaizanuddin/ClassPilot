import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createAccount } from "../../services/auth";

export default function SignupScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!username.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await createAccount(username, password);
      router.replace("/(auth)/profile-setup");
    } catch (e: any) {
      setError(e?.message || "Unable to create account.");
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
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.back}
            >
              <Text style={styles.backText}>‹</Text>
              <Text style={styles.backLabel}>Back</Text>
            </TouchableOpacity>

            <View style={styles.logo}>
              <Text style={styles.logoText}>C</Text>
            </View>

            <Text style={styles.brand}>CLASSPILOT</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Set up your teacher workspace in a few seconds.
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                style={styles.input}
              />

              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#64748B"
                secureTextEntry
                style={styles.input}
              />

              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor="#64748B"
                secureTextEntry
                style={styles.input}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#1677FF", "#00B8FF"]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Creating..." : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
              >
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 22,
    justifyContent: "center",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backText: {
    color: "#38BDF8",
    fontSize: 30,
    lineHeight: 30,
  },
  backLabel: {
    color: "#94A3B8",
    fontSize: 14,
    marginLeft: 5,
  },
  logo: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#0D2344",
    borderWidth: 1,
    borderColor: "#1B7CFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  logoText: {
    color: "#36B9FF",
    fontSize: 31,
    fontWeight: "900",
  },
  brand: {
    textAlign: "center",
    color: "#5EC8FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 22,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
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
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    height: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#23476E",
    backgroundColor: "#071426",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  loginText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  loginLink: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "800",
  },
});

