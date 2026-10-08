import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Sparkles,
} from "lucide-react-native";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const items = [
    { label: "Home", icon: House, route: "/teacher-dashboard" },
    { label: "Syllabi", icon: BookOpen, route: "/syllabi" },
    { label: "Classes", icon: CalendarDays, route: "/classes" },
    { label: "Analytics", icon: ChartNoAxesCombined, route: "/analytics" },
    { label: "AI", icon: Sparkles, route: "/copilot" },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.bar}>
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.route ||
            pathname.startsWith(item.route + "/");

          return (
            <Pressable
              key={item.route}
              style={styles.item}
              onPress={() => {
                if (!active) {
                  router.replace(item.route);
                }
              }}
            >
              <View style={[styles.iconWrap, active && styles.activeIconWrap]}>
                <Icon
                  size={21}
                  strokeWidth={active ? 2.5 : 2}
                  color={active ? "#55D9FF" : "#71859A"}
                />
              </View>

              <Text style={[styles.label, active && styles.activeLabel]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#050B14",
    paddingTop: 8,
  },

  bar: {
    height: 70,
    marginHorizontal: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1A2C40",
    backgroundColor: "#09121E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  item: {
    flex: 1,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrap: {
    width: 38,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  activeIconWrap: {
    backgroundColor: "#0D2940",
  },

  label: {
    color: "#71859A",
    fontSize: 9,
    fontWeight: "700",
  },

  activeLabel: {
    color: "#55D9FF",
  },
});
