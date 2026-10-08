import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Eye, EyeOff, ArrowLeft, LockKeyhole, User } from "lucide-react-native";
import { loginUser } from "../../services/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const success = await loginUser(username.trim(), password);

      if (!success) {
        setError("Incorrect username or password.");
        return;
      }

      // IMPORTANT:
      // replace() removes Login from navigation history.
      router.replace("/teacher-dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/welcome")}
          >
            <ArrowLeft size={20} color="#DDEBFF" />
          </Pressable>

          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>C</Text>
            </View>

            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Sign in to continue managing your classroom with ClassPilot.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>USERNAME</Text>

            <View style={styles.inputWrap}>
              <User size={19} color="#71859A" />

              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor="#506174"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>PASSWORD</Text>

            <View style={styles.inputWrap}>
              <LockKeyhole size={19} color="#71859A" />

              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#506174"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={10}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#55D9FF" />
                ) : (
                  <Eye size={20} color="#71859A" />
                )}
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>

              <Pressable onPress={() => router.replace("/(auth)/signup")}>
                <Text style={styles.signupLink}>Create account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050B14",
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 40,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1A2C40",
    backgroundColor: "#09121E",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginTop: 34,
    marginBottom: 36,
  },

  logo: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#0D2940",
    borderWidth: 1,
    borderColor: "#1D6685",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logoText: {
    color: "#55D9FF",
    fontSize: 34,
    fontWeight: "900",
  },

  title: {
    color: "#F5FAFF",
    fontSize: 29,
    fontWeight: "800",
  },

  subtitle: {
    color: "#8294A8",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    maxWidth: 330,
  },

  form: {
    width: "100%",
  },

  label: {
    color: "#8FA3B8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 18,
  },

  inputWrap: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1A2C40",
    backgroundColor: "#09121E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    color: "#F5FAFF",
    fontSize: 15,
    marginLeft: 12,
    paddingVertical: 15,
  },

  eyeButton: {
    width: 36,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  errorBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#29151A",
    borderWidth: 1,
    borderColor: "#66303A",
  },

  errorText: {
    color: "#FF9CA8",
    fontSize: 13,
  },

  loginButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1687C7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  signupText: {
    color: "#71859A",
    fontSize: 13,
  },

  signupLink: {
    color: "#55D9FF",
    fontSize: 13,
    fontWeight: "800",
  },
});
