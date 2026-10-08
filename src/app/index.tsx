import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#07152F", "#0B2347", "#06101F"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glow} />

      <View style={styles.center}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.title}>ClassPilot</Text>

        <Text style={styles.subtitle}>
          Your AI Copilot for Smarter Teaching
        </Text>

        <View style={styles.loading}>
          <View style={styles.loadingBar} />
        </View>
      </View>

      <Text style={styles.bottom}>SMARTER • SIMPLER • CONNECTED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06101F",
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#087EFF",
    opacity: 0.08,
    top: "30%",
  },

  center: {
    alignItems: "center",
  },

  logo: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#0B8CFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#1597FF",
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "800",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#A9BAD2",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  loading: {
    width: 90,
    height: 3,
    backgroundColor: "#173452",
    borderRadius: 5,
    marginTop: 32,
    overflow: "hidden",
  },

  loadingBar: {
    width: 55,
    height: 3,
    backgroundColor: "#19A7FF",
    borderRadius: 5,
  },

  bottom: {
    position: "absolute",
    bottom: 35,
    color: "#5D7695",
    fontSize: 9,
    letterSpacing: 2,
  },
});

