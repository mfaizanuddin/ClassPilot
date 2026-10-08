import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={["#F8FBFF", "#EEF6FF", "#FFFFFF"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.top}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.brand}>ClassPilot</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.aiOrb}>
          <View style={styles.orbInner}>
            <Text style={styles.orbText}>AI</Text>
          </View>
        </View>

        <Text style={styles.title}>
          Your AI Copilot{"\n"}
          <Text style={styles.blue}>for Smarter Teaching</Text>
        </Text>

        <Text style={styles.description}>
          Plan lessons, understand your syllabus, create assessments,
          track student progress, and teach with confidence.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={styles.primary}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.primaryText}>Get Started</Text>
          <Text style={styles.arrow}>?</Text>
        </Pressable>

        <Pressable
          style={styles.secondary}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.secondaryText}>
            Already have an account? <Text style={styles.login}>Log in</Text>
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          AI-powered teaching • Built for educators
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 24,
  },

  top: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#087EFF",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  brand: {
    marginLeft: 12,
    fontSize: 22,
    fontWeight: "800",
    color: "#10233F",
  },

  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },

  aiOrb: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#DDF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  orbInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#087EFF",
    alignItems: "center",
    justifyContent: "center",
  },

  orbText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  title: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "800",
    color: "#10233F",
    textAlign: "center",
  },

  blue: {
    color: "#087EFF",
  },

  description: {
    marginTop: 18,
    maxWidth: 340,
    fontSize: 15,
    lineHeight: 23,
    color: "#667892",
    textAlign: "center",
  },

  bottom: {
    paddingBottom: 8,
  },

  primary: {
    height: 58,
    borderRadius: 17,
    backgroundColor: "#087EFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 12,
  },

  secondary: {
    alignItems: "center",
    paddingVertical: 15,
  },

  secondaryText: {
    color: "#71829A",
    fontSize: 13,
  },

  login: {
    color: "#087EFF",
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#A1AFC0",
    fontSize: 10,
    marginTop: 2,
  },
});

