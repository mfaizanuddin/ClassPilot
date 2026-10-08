import BottomNav from "../components/BottomNav";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  Pencil,
  Trash2,
  Clock3,
  MapPin,
  Users,
  X,
  ChevronLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  ClassSchedule,
  addClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../services/classpilot-data";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ClassesScreen() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<ClassSchedule | null>(null);

  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const data = await getClasses();
    setClasses(data);
  };

  const openAdd = () => {
    setEditing(null);
    setSubject("");
    setSection("");
    setRoom("");
    setStartTime("");
    setEndTime("");
    setModalVisible(true);
  };

  const openEdit = (item: ClassSchedule) => {
    setEditing(item);
    setSubject(item.subject);
    setSection(item.section);
    setRoom(item.room);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setModalVisible(true);
  };

  const save = async () => {
    if (
      !subject.trim() ||
      !section.trim() ||
      !startTime.trim() ||
      !endTime.trim()
    ) {
      Alert.alert(
        "Missing information",
        "Please enter subject, class/section, start time and end time."
      );
      return;
    }

    if (editing) {
      await updateClass({
        ...editing,
        day: selectedDay,
        subject: subject.trim(),
        section: section.trim(),
        room: room.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      });
    } else {
      await addClass({
        id: Date.now().toString(),
        day: selectedDay,
        subject: subject.trim(),
        section: section.trim(),
        room: room.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      });
    }

    setModalVisible(false);
    await loadClasses();
  };

  const remove = (id: string) => {
    Alert.alert(
      "Delete class?",
      "This class will be removed from the timetable.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteClass(id);
            await loadClasses();
          },
        },
      ]
    );
  };

  const dayClasses = classes
    .filter((item) => item.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => router.back()}
          >
            <ChevronLeft size={23} color="#DDEBFA" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>MANAGEMENT</Text>
            <Text style={styles.title}>Classes & Timetable</Text>
          </View>

          <TouchableOpacity style={styles.addTop} onPress={openAdd}>
            <Plus size={21} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Manage every class, section, room and teaching time.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.days}
          contentContainerStyle={styles.daysContent}
        >
          {DAYS.map((day) => {
            const active = selectedDay === day;
            const count = classes.filter((c) => c.day === day).length;

            return (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[styles.dayTab, active && styles.dayTabActive]}
              >
                <Text
                  style={[styles.dayText, active && styles.dayTextActive]}
                >
                  {day.slice(0, 3)}
                </Text>
                <View
                  style={[
                    styles.dayCount,
                    active && styles.dayCountActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayCountText,
                      active && styles.dayCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      <BottomNav />

        <View style={styles.dayHeader}>
          <View>
            <Text style={styles.dayTitle}>{selectedDay}</Text>
            <Text style={styles.daySubtitle}>
              {dayClasses.length}{" "}
              {dayClasses.length === 1 ? "class" : "classes"} scheduled
            </Text>
          </View>

          <TouchableOpacity onPress={openAdd} style={styles.addButton}>
            <Plus size={17} color="#FFFFFF" />
            <Text style={styles.addText}>Add class</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {dayClasses.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Clock3 size={28} color="#4DC7FF" />
              </View>

              <Text style={styles.emptyTitle}>
                No classes on {selectedDay}
              </Text>

              <Text style={styles.emptyText}>
                Add a class and set its exact teaching time.
              </Text>

              <TouchableOpacity onPress={openAdd} style={styles.emptyButton}>
                <Plus size={17} color="#FFFFFF" />
                <Text style={styles.emptyButtonText}>
                  Add first class
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            dayClasses.map((item, index) => (
              <View key={item.id} style={styles.classCard}>
                <View style={styles.timeline}>
                  <View style={styles.timelineDot} />
                  {index !== dayClasses.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                <View style={styles.timeColumn}>
                  <Text style={styles.start}>{item.startTime}</Text>
                  <Text style={styles.end}>{item.endTime}</Text>
                </View>

                <View style={styles.classMain}>
                  <Text style={styles.subject}>{item.subject}</Text>

                  <View style={styles.metaRow}>
                    <Users size={13} color="#6DBFEA" />
                    <Text style={styles.meta}>
                      {item.section}
                    </Text>
                  </View>

                  {item.room ? (
                    <View style={styles.metaRow}>
                      <MapPin size={13} color="#6DBFEA" />
                      <Text style={styles.meta}>{item.room}</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => openEdit(item)}
                  >
                    <Pencil size={16} color="#5BC9FF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => remove(item.id)}
                  >
                    <Trash2 size={16} color="#FF7180" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      <BottomNav />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalEyebrow}>
                    {editing ? "EDIT CLASS" : "NEW CLASS"}
                  </Text>
                  <Text style={styles.modalTitle}>
                    {editing ? "Update class" : "Add a class"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.close}
                  onPress={() => setModalVisible(false)}
                >
                  <X size={20} color="#B7C7D9" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>DAY</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 125, gap: 7 }}
                >
                  {DAYS.map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setSelectedDay(day)}
                      style={[
                        styles.modalDay,
                        selectedDay === day && styles.modalDayActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalDayText,
                          selectedDay === day &&
                            styles.modalDayTextActive,
                        ]}
                      >
                        {day.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
      <BottomNav />

                <Text style={styles.inputLabel}>SUBJECT</Text>
                <TextInput
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="e.g. Computer Science"
                  placeholderTextColor="#58708A"
                  style={styles.input}
                />

                <Text style={styles.inputLabel}>CLASS / SECTION</Text>
                <TextInput
                  value={section}
                  onChangeText={setSection}
                  placeholder="e.g. CSE-A"
                  placeholderTextColor="#58708A"
                  style={styles.input}
                />

                <Text style={styles.inputLabel}>ROOM</Text>
                <TextInput
                  value={room}
                  onChangeText={setRoom}
                  placeholder="e.g. Lab 204"
                  placeholderTextColor="#58708A"
                  style={styles.input}
                />

                <View style={styles.timeRow}>
                  <View style={styles.timeInput}>
                    <Text style={styles.inputLabel}>START TIME</Text>
                    <TextInput
                      value={startTime}
                      onChangeText={setStartTime}
                      placeholder="09:30 AM"
                      placeholderTextColor="#58708A"
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.timeInput}>
                    <Text style={styles.inputLabel}>END TIME</Text>
                    <TextInput
                      value={endTime}
                      onChangeText={setEndTime}
                      placeholder="10:30 AM"
                      placeholderTextColor="#58708A"
                      style={styles.input}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={save}
                  style={styles.saveButton}
                >
                  <LinearGradient
                    colors={["#147BDE", "#08B9F4"]}
                    style={styles.saveGradient}
                  >
                    <Text style={styles.saveText}>
                      {editing ? "Save Changes" : "Add Class"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 25 }} />
              </ScrollView>
      <BottomNav />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#040A14" },
  screen: { flex: 1, backgroundColor: "#040A14" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#0B1728",
    borderWidth: 1,
    borderColor: "#19344F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  headerText: { flex: 1 },
  eyebrow: {
    color: "#45C3FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    color: "#F4F8FF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 3,
  },
  addTop: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#147BDE",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    color: "#6F87A0",
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 18,
    marginTop: 8,
  },

  days: { marginTop: 20 },
  daysContent: {
    paddingHorizontal: 18,
    gap: 8,
  },
  dayTab: {
    height: 48,
    minWidth: 64,
    borderRadius: 14,
    backgroundColor: "#091625",
    borderWidth: 1,
    borderColor: "#18314B",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
  },
  dayTabActive: {
    backgroundColor: "#0C3A60",
    borderColor: "#2099DD",
  },
  dayText: {
    color: "#7189A3",
    fontSize: 12,
    fontWeight: "800",
  },
  dayTextActive: { color: "#FFFFFF" },
  dayCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#12273C",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCountActive: { backgroundColor: "#1B8ACA" },
  dayCountText: {
    color: "#7189A3",
    fontSize: 9,
    fontWeight: "800",
  },
  dayCountTextActive: { color: "#FFFFFF" },

  dayHeader: {
    paddingHorizontal: 18,
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    color: "#F0F6FF",
    fontSize: 18,
    fontWeight: "800",
  },
  daySubtitle: {
    color: "#617991",
    fontSize: 10,
    marginTop: 3,
  },
  addButton: {
    height: 37,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: "#0D4168",
    borderWidth: 1,
    borderColor: "#1B78AE",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addText: {
    color: "#55C9FF",
    fontSize: 11,
    fontWeight: "800",
  },

  list: {
    paddingHorizontal: 18,
  },
  classCard: {
    minHeight: 106,
    borderRadius: 18,
    backgroundColor: "#091625",
    borderWidth: 1,
    borderColor: "#17314A",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  timeline: {
    width: 22,
    height: "100%",
    alignItems: "center",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38BFFF",
    marginTop: 28,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: "#20425E",
    marginTop: 5,
  },
  timeColumn: {
    width: 70,
    alignItems: "flex-start",
  },
  start: {
    color: "#E9F5FF",
    fontSize: 12,
    fontWeight: "800",
  },
  end: {
    color: "#627A94",
    fontSize: 10,
    marginTop: 5,
  },
  classMain: {
    flex: 1,
    paddingVertical: 15,
  },
  subject: {
    color: "#F1F6FC",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  meta: {
    color: "#7890A8",
    fontSize: 10,
  },
  actions: {
    paddingRight: 10,
    gap: 7,
  },
  action: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#0D1F33",
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    borderRadius: 20,
    backgroundColor: "#091625",
    borderWidth: 1,
    borderColor: "#17314A",
    alignItems: "center",
    padding: 30,
    marginTop: 5,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#0C2945",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  emptyTitle: {
    color: "#EDF5FF",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    color: "#6B829A",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
  emptyButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#147BDE",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  modal: {
    maxHeight: "92%",
    backgroundColor: "#071321",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#1A3854",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalEyebrow: {
    color: "#42C2FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
  modalTitle: {
    color: "#F2F7FF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  close: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#0D1E31",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    color: "#78A6C8",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 7,
    marginTop: 8,
  },
  modalDay: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#0A1B2C",
    borderWidth: 1,
    borderColor: "#193650",
    alignItems: "center",
    justifyContent: "center",
  },
  modalDayActive: {
    backgroundColor: "#0D527E",
    borderColor: "#29A8E9",
  },
  modalDayText: {
    color: "#718AA2",
    fontSize: 11,
    fontWeight: "800",
  },
  modalDayTextActive: { color: "#FFFFFF" },
  input: {
    height: 49,
    borderRadius: 13,
    backgroundColor: "#091A2B",
    borderWidth: 1,
    borderColor: "#1A3853",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 13,
    marginBottom: 9,
  },
  timeRow: {
    flexDirection: "row",
    gap: 10,
  },
  timeInput: { flex: 1 },
  saveButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 14,
  },
  saveGradient: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});



