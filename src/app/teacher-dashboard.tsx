import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  House,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Sparkles,
  Bot,
  Upload,
  ClipboardCheck,
  Clock,
  ChevronRight,
  UserCircle,
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronLeft,
  Search,
  MoreVertical,
  Lock,
  Eye,
  FileText,
  Paperclip,
  CloudUpload,
  School,
  Users,
  Target,
  Brain,
  Bell,
  RefreshCw,
  MessageCircleQuestion,
  Trophy,
  TriangleAlert,
  ClipboardList,
  Route,
  NotebookPen,
  Presentation,
  BookOpenCheck,
} from "lucide-react-native";
import { getUser, logoutUser } from "../services/auth";
import { getClasses, ClassSchedule } from "../services/classpilot-data";
import BottomNav from "../components/BottomNav";

export default function TeacherDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.replace("/(auth)/login");
  }


  const [name, setName] = useState("Teacher");
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [subject, setSubject] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const user = await getUser();
    if (user?.name) setName(user.name);
    if (user?.subject) setSubject(user.subject);
    if (user?.subject) setSubject(user.subject);

    const savedClasses = await getClasses();
    setClasses(savedClasses);
  }

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = dayNames[new Date().getDay()];

  const todayClasses = classes
    .filter((item) => item.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: 125,
          },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.small}>GOOD MORNING</Text>
            <Text style={styles.title}>Hi, {name}</Text>
            <Text style={styles.subtitle}>
              Ready to make today smarter?
            </Text>
          </View>
          <Pressable
            style={styles.profile}
            onPress={() => setProfileOpen(true)}
          >
            <Text style={styles.profileText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>

        <LinearGradient
          colors={["#123B68", "#071426"]}
          style={styles.aiCard}
        >
          <View style={styles.aiOrb}>
            <Sparkles size={30} color="#55D9FF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.aiLabel}>CLASS PILOT AI</Text>
            <Text style={styles.aiTitle}>
              Your teaching copilot is ready.
            </Text>
            <Text style={styles.aiSub}>
              Plan lessons, understand your syllabus and create assessments.
            </Text>
          </View>
        </LinearGradient>

        <Text style={styles.section}>Today Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <BookOpen size={22} color="#55D9FF" />
            <Text style={styles.statNumber}>{classes.length}</Text>
            <Text style={styles.statLabel}>Total Classes</Text>
          </View>

          <View style={styles.statCard}>
            <CalendarDays size={22} color="#55D9FF" />
            <Text style={styles.statNumber}>{todayClasses.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>

          <View style={styles.statCard}>
            <ChartNoAxesCombined size={22} color="#55D9FF" />
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Analytics</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Quick Actions</Text>
        </View>

        <View style={styles.quickGrid}>
          <Pressable
            style={styles.quickCard}
            onPress={() => router.push("/syllabi")}
          >
            <Upload size={24} color="#55D9FF" />
            <Text style={styles.quickTitle}>Add Syllabus</Text>
            <Text style={styles.quickSub}>Upload & manage</Text>
          </Pressable>

          <Pressable
            style={styles.quickCard}
            onPress={() => router.push("/classes")}
          >
            <CalendarDays size={24} color="#55D9FF" />
            <Text style={styles.quickTitle}>Timetable</Text>
            <Text style={styles.quickSub}>Edit classes</Text>
          </Pressable>

          <Pressable
            style={styles.quickCard}
            onPress={() => router.push("/assessment")}
          >
            <ClipboardCheck size={24} color="#55D9FF" />
            <Text style={styles.quickTitle}>Assessment</Text>
            <Text style={styles.quickSub}>Create tests</Text>
          </Pressable>

          <Pressable
            style={styles.quickCard}
            onPress={() => router.push("/copilot")}
          >
            <Sparkles size={24} color="#55D9FF" />
            <Text style={styles.quickTitle}>AI Copilot</Text>
            <Text style={styles.quickSub}>Ask ClassPilot AI</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Today's Classes</Text>

          <Pressable onPress={() => router.push("/classes")}>
            <Text style={styles.viewAll}>Manage</Text>
          </Pressable>
        </View>

        {todayClasses.length === 0 ? (
          <Pressable
            style={styles.emptyCard}
            onPress={() => router.push("/classes")}
          >
            <CalendarDays size={26} color="#55D9FF" />

            <View style={{ flex: 1 }}>
              <Text style={styles.emptyTitle}>No classes scheduled</Text>
              <Text style={styles.emptySub}>
                Add Monday–Saturday classes and timings.
              </Text>
            </View>

            <ChevronRight size={20} color="#7C91A8" />
          </Pressable>
        ) : (
          todayClasses.map((item) => (
            <Pressable
              key={item.id}
              style={styles.classCard}
              onPress={() => router.push("/classes")}
            >
              <View style={styles.timeBox}>
                <Clock size={17} color="#55D9FF" />
                <Text style={styles.time}>{item.startTime}</Text>
                <Text style={styles.end}>{item.endTime}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.classSubject}>{item.subject}</Text>
                <Text style={styles.classMeta}>
                  {item.section} • {item.room || "Room not set"}
                </Text>
              </View>

              <ChevronRight size={20} color="#71849A" />
            </Pressable>
          ))
        )}
      </ScrollView>

      <BottomNav /></SafeAreaView>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <View style={{ opacity: active ? 1 : 0.55 }}>{icon}</View>

      <Text style={[styles.navLabel, active && styles.navActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050B14",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  small: {
    color: "#6E849C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 4,
  },

  subtitle: {
    color: "#8295AA",
    fontSize: 13,
    marginTop: 4,
  },

  profile: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#12375E",
    borderWidth: 1,
    borderColor: "#287DA9",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },

  aiCard: {
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: "#1B527B",
    marginBottom: 24,
  },

  aiOrb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A253D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2F91BB",
  },

  aiLabel: {
    color: "#55D9FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  aiSub: {
    color: "#A4B4C5",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 12,
  },

  section: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  viewAll: {
    color: "#55D9FF",
    fontSize: 12,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#0B1421",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#17283A",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 9,
  },

  statLabel: {
    color: "#7D91A6",
    fontSize: 10,
    marginTop: 3,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#0B1421",
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: "#17283A",
  },

  quickTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
    marginTop: 12,
  },

  quickSub: {
    color: "#71859A",
    fontSize: 10,
    marginTop: 4,
  },

  emptyCard: {
    backgroundColor: "#0B1421",
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: "#17283A",
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  emptySub: {
    color: "#71859A",
    fontSize: 10,
    marginTop: 4,
  },

  classCard: {
    backgroundColor: "#0B1421",
    borderRadius: 17,
    padding: 13,
    borderWidth: 1,
    borderColor: "#17283A",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 9,
  },

  timeBox: {
    width: 65,
    alignItems: "center",
    paddingVertical: 5,
  },

  time: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },

  end: {
    color: "#64798E",
    fontSize: 9,
    marginTop: 2,
  },

  classSubject: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  classMeta: {
    color: "#71859A",
    fontSize: 10,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },

  profileModal: {
    width: "82%",
    maxWidth: 360,
    backgroundColor: "#0B1727",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#245070",
    padding: 22,
    alignItems: "center",
    elevation: 20,
  },

  modalAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#123B68",
    borderWidth: 1,
    borderColor: "#38BDF8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  modalAvatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  modalName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  modalSubject: {
    color: "#7DD3FC",
    fontSize: 13,
    marginTop: 5,
  },

  modalDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#1D3348",
    marginVertical: 20,
  },

  editProfileButton: {
    width: "100%",
    height: 48,
    borderRadius: 13,
    backgroundColor: "#102A44",
    borderWidth: 1,
    borderColor: "#245070",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  editProfileText: {
    color: "#55D9FF",
    fontSize: 13,
    fontWeight: "800",
  },

  logoutButton: {
    width: "100%",
    height: 48,
    borderRadius: 13,
    backgroundColor: "#30191D",
    borderWidth: 1,
    borderColor: "#6D363D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  logoutText: {
    color: "#FF8B8B",
    fontSize: 13,
    fontWeight: "800",
  },

  cancelButton: {
    width: "100%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#71859A",
    fontSize: 12,
    fontWeight: "700",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
});














