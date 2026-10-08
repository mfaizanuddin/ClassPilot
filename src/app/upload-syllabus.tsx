import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react-native";

const API_URL = "http://192.168.0.101:3000";
const SYLLABUS_KEY = "classpilot_syllabus";

export default function UploadSyllabusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState<any>(null);

  async function pickSyllabus() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "text/plain",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const file = result.assets[0];

      await analyzeSyllabus(file);
    } catch (error) {
      console.error("Document picker error:", error);

      Alert.alert(
        "Upload failed",
        "We couldn't select the document."
      );
    }
  }

  async function analyzeSyllabus(file: any) {
    setLoading(true);
    setSyllabus(null);

    try {
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name || "syllabus.pdf",
        type: file.mimeType || "application/pdf",
      } as any);

      const response = await fetch(
        `${API_URL}/api/syllabus/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.error || "Syllabus analysis failed."
        );
      }

      await AsyncStorage.setItem(
        SYLLABUS_KEY,
        JSON.stringify(data.syllabus)
      );

      setSyllabus(data.syllabus);
    } catch (error) {
      console.error("Syllabus analysis error:", error);

      Alert.alert(
        "AI analysis failed",
        error instanceof Error
          ? error.message
          : "Unable to analyze the syllabus."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalTopics =
    syllabus?.totalTopics ||
    syllabus?.units?.reduce(
      (total: number, unit: any) =>
        total + (unit.topics?.length || 0),
      0
    ) ||
    0;

  return (
    <View style={styles.safe}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/syllabi")}
          >
            <ArrowLeft size={21} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              Upload Syllabus
            </Text>
            <Text style={styles.headerSubtitle}>
              Turn your syllabus into a teaching roadmap
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: insets.bottom + 30,
            },
          ]}
        >
          {!syllabus && !loading && (
            <>
              <View style={styles.heroCard}>
                <View style={styles.heroIcon}>
                  <Sparkles size={28} color="#FFFFFF" />
                </View>

                <Text style={styles.heroTitle}>
                  Let ClassPilot understand your syllabus
                </Text>

                <Text style={styles.heroDescription}>
                  Upload your syllabus and ClassPilot AI will
                  identify units, topics, dependencies and
                  estimated teaching time.
                </Text>
              </View>

              <Pressable
                style={styles.uploadCard}
                onPress={pickSyllabus}
              >
                <View style={styles.uploadIcon}>
                  <Upload size={25} color="#FFFFFF" />
                </View>

                <Text style={styles.uploadTitle}>
                  Upload Document
                </Text>

                <Text style={styles.uploadSubtitle}>
                  PDF or TXT • Maximum 15 MB
                </Text>

                <View style={styles.chooseButton}>
                  <FileText size={17} color="#FFFFFF" />
                  <Text style={styles.chooseButtonText}>
                    Choose Syllabus
                  </Text>
                </View>
              </Pressable>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>
                  What ClassPilot will extract
                </Text>

                {[
                  "Units and chapters",
                  "Individual teaching topics",
                  "Topic dependencies",
                  "Estimated teaching time",
                  "Difficulty indicators",
                  "Overall syllabus workload",
                ].map((item) => (
                  <View style={styles.infoRow} key={item}>
                    <CheckCircle2
                      size={16}
                      color="#28B8FF"
                    />
                    <Text style={styles.infoText}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {loading && (
            <View style={styles.processingCard}>
              <View style={styles.processingIcon}>
                <Sparkles size={30} color="#FFFFFF" />
              </View>

              <ActivityIndicator
                size="large"
                color="#28B8FF"
                style={{ marginTop: 20 }}
              />

              <Text style={styles.processingTitle}>
                ClassPilot is analyzing your syllabus
              </Text>

              <Text style={styles.processingText}>
                Reading the document, identifying units and
                topics, and building your teaching structure...
              </Text>
            </View>
          )}

          {syllabus && !loading && (
            <>
              <View style={styles.successCard}>
                <View style={styles.successIcon}>
                  <CheckCircle2 size={25} color="#FFFFFF" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.successTitle}>
                    Syllabus understood
                  </Text>

                  <Text style={styles.successText}>
                    {syllabus.sourceFile}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.subjectTitle}>
                  {syllabus.subject ||
                    syllabus.title ||
                    "Your Syllabus"}
                </Text>

                {syllabus.course ? (
                  <Text style={styles.courseText}>
                    {syllabus.course}
                  </Text>
                ) : null}

                <Text style={styles.summaryText}>
                  {syllabus.summary ||
                    "Your syllabus has been converted into a structured teaching plan."}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                      {syllabus.units?.length || 0}
                    </Text>
                    <Text style={styles.statLabel}>
                      Units
                    </Text>
                  </View>

                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                      {totalTopics}
                    </Text>
                    <Text style={styles.statLabel}>
                      Topics
                    </Text>
                  </View>

                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                      {syllabus.estimatedTotalHours || 0}
                    </Text>
                    <Text style={styles.statLabel}>
                      Hours
                    </Text>
                  </View>
                </View>
              </View>

              {syllabus.units?.map(
                (unit: any, index: number) => (
                  <View
                    style={styles.unitCard}
                    key={`${unit.unitNumber}-${index}`}
                  >
                    <View style={styles.unitHeader}>
                      <View style={styles.unitNumber}>
                        <Text style={styles.unitNumberText}>
                          {unit.unitNumber}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.unitTitle}>
                          {unit.title}
                        </Text>

                        <Text style={styles.topicCount}>
                          {unit.topics?.length || 0} topics
                        </Text>
                      </View>
                    </View>

                    {unit.topics?.map(
                      (topic: any, topicIndex: number) => (
                        <View
                          style={styles.topicRow}
                          key={`${topic.name}-${topicIndex}`}
                        >
                          <View style={styles.topicDot} />

                          <View style={{ flex: 1 }}>
                            <Text style={styles.topicName}>
                              {topic.name}
                            </Text>

                            <Text style={styles.topicMeta}>
                              {topic.estimatedMinutes || 45} min
                              {"  •  "}
                              {topic.difficulty || "medium"}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                )
              )}

              <Pressable
                style={styles.continueButton}
                onPress={() => router.replace("/syllabi")}
              >
                <BookOpen size={19} color="#FFFFFF" />

                <Text style={styles.continueText}>
                  Continue to My Syllabi
                </Text>
              </Pressable>

              <Pressable
                style={styles.uploadAnother}
                onPress={() => setSyllabus(null)}
              >
                <Text style={styles.uploadAnotherText}>
                  Upload another syllabus
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050B14",
  },

  container: {
    flex: 1,
    backgroundColor: "#050B14",
  },

  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#142238",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D1727",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#718096",
    fontSize: 11,
    marginTop: 3,
  },

  content: {
    padding: 16,
  },

  heroCard: {
    backgroundColor: "#0B1626",
    borderWidth: 1,
    borderColor: "#19314B",
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
  },

  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#0877B9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
  },

  heroDescription: {
    color: "#9CA9BA",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },

  uploadCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#2876A6",
    backgroundColor: "#091523",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  uploadIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#0877B9",
    alignItems: "center",
    justifyContent: "center",
  },

  uploadTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
  },

  uploadSubtitle: {
    color: "#718096",
    fontSize: 12,
    marginTop: 5,
  },

  chooseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0877B9",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 18,
  },

  chooseButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  infoCard: {
    backgroundColor: "#0B1626",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#142238",
    padding: 18,
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  infoText: {
    color: "#B5C0CF",
    fontSize: 13,
    marginLeft: 9,
  },

  processingCard: {
    backgroundColor: "#0B1626",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#19314B",
    padding: 30,
    alignItems: "center",
    marginTop: 30,
  },

  processingIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#0877B9",
    alignItems: "center",
    justifyContent: "center",
  },

  processingTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 22,
  },

  processingText: {
    color: "#8D9CAF",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 10,
  },

  successCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1626",
    borderWidth: 1,
    borderColor: "#1B4A54",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  successIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#0877B9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  successTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  successText: {
    color: "#718096",
    fontSize: 11,
    marginTop: 3,
  },

  summaryCard: {
    backgroundColor: "#0B1626",
    borderWidth: 1,
    borderColor: "#19314B",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  subjectTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  courseText: {
    color: "#28B8FF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },

  summaryText: {
    color: "#9CA9BA",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#17283D",
    paddingTop: 16,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  statLabel: {
    color: "#718096",
    fontSize: 10,
    marginTop: 3,
  },

  unitCard: {
    backgroundColor: "#0B1626",
    borderWidth: 1,
    borderColor: "#142238",
    borderRadius: 20,
    padding: 17,
    marginBottom: 12,
  },

  unitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  unitNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#0877B9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  unitNumberText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  unitTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  topicCount: {
    color: "#718096",
    fontSize: 10,
    marginTop: 3,
  },

  topicRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#132238",
  },

  topicDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#28B8FF",
    marginTop: 6,
    marginRight: 10,
  },

  topicName: {
    color: "#DCE5EF",
    fontSize: 13,
    fontWeight: "600",
  },

  topicMeta: {
    color: "#68788D",
    fontSize: 10,
    marginTop: 4,
  },

  continueButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#0877B9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 5,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  uploadAnother: {
    alignItems: "center",
    paddingVertical: 17,
  },

  uploadAnotherText: {
    color: "#28B8FF",
    fontSize: 12,
    fontWeight: "700",
  },
});
