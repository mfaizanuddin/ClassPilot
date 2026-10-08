import BottomNav from "../components/BottomNav";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  ChevronLeft,
  Plus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  deleteSyllabus,
  getSyllabi,
  saveSyllabus,
  SyllabusFile,
} from "../services/classpilot-data";

export default function SyllabiScreen() {
  const router = useRouter();
  const [syllabi, setSyllabi] = useState<SyllabusFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setSyllabi(await getSyllabi());
  };

  const upload = async () => {
    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      await saveSyllabus({
        id: Date.now().toString(),
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
        size: file.size,
        createdAt: new Date().toISOString(),
      });

      await load();

      Alert.alert(
        "Syllabus added",
        `${file.name} is now available in your ClassPilot workspace.`
      );
    } catch {
      Alert.alert("Upload failed", "Unable to add this syllabus.");
    } finally {
      setUploading(false);
    }
  };

  const remove = (id: string) => {
    Alert.alert(
      "Delete syllabus?",
      "This syllabus will be removed from your ClassPilot workspace.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSyllabus(id);
            await load();
          },
        },
      ]
    );
  };

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

          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>ACADEMIC CONTENT</Text>
            <Text style={styles.title}>My Syllabi</Text>
          </View>

          <TouchableOpacity style={styles.topButton} onPress={upload}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <LinearGradient
            colors={["#0D3158", "#0A1D35"]}
            style={styles.uploadCard}
          >
            <View style={styles.uploadIcon}>
              <Upload size={25} color="#5BD0FF" />
            </View>

            <Text style={styles.uploadTitle}>
              Upload your syllabus
            </Text>

            <Text style={styles.uploadText}>
              Add a PDF, Word document or text syllabus. ClassPilot will
              organize it into units and topics for your teaching workflow.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={upload}
              style={styles.uploadButton}
              disabled={uploading}
            >
              <Upload size={17} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>
                {uploading ? "Adding..." : "Choose syllabus"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your syllabi</Text>
              <Text style={styles.sectionSubtitle}>
                {syllabi.length}{" "}
                {syllabi.length === 1 ? "syllabus" : "syllabi"} saved
              </Text>
            </View>
          </View>

          {syllabi.length === 0 ? (
            <View style={styles.empty}>
              <FileText size={30} color="#4BBEFF" />
              <Text style={styles.emptyTitle}>
                No syllabus uploaded yet
              </Text>
              <Text style={styles.emptyText}>
                Upload your first syllabus to start building your teaching
                roadmap.
              </Text>
            </View>
          ) : (
            syllabi.map((item) => (
              <View key={item.id} style={styles.fileCard}>
                <View style={styles.fileIcon}>
                  <FileText size={22} color="#54C9FF" />
                </View>

                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <Text style={styles.fileMeta}>
                    {item.mimeType?.includes("pdf")
                      ? "PDF"
                      : "DOCUMENT"}{" "}
                    • Uploaded{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>

                  <View style={styles.aiReady}>
                    <Sparkles size={12} color="#4DC7FF" />
                    <Text style={styles.aiReadyText}>
                      Ready for AI processing
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => remove(item.id)}
                >
                  <Trash2 size={17} color="#FF7280" />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={styles.tip}>
            <Sparkles size={17} color="#5CCBFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>
                Next: AI syllabus analysis
              </Text>
              <Text style={styles.tipText}>
                Once AI processing is connected, uploaded syllabi will be
                converted into units, topics and teaching plans automatically.
              </Text>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#040A14",
  },
  screen: {
    flex: 1,
    backgroundColor: "#040A14",
  },
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
  eyebrow: {
    color: "#45C3FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    color: "#F4F8FF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 3,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#147BDE",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  uploadCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1C5B8D",
    padding: 20,
    overflow: "hidden",
  },
  uploadIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: "#0C3559",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
  },
  uploadText: {
    color: "#91ABC4",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  uploadButton: {
    height: 46,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: "#147BDE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 17,
    alignSelf: "flex-start",
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  sectionHeader: {
    marginTop: 27,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#ECF5FF",
    fontSize: 17,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#657D97",
    fontSize: 11,
    marginTop: 3,
  },
  empty: {
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#17314A",
    backgroundColor: "#091625",
    alignItems: "center",
    padding: 30,
  },
  emptyTitle: {
    color: "#EAF3FF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 13,
  },
  emptyText: {
    color: "#687F97",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 5,
  },
  fileCard: {
    minHeight: 96,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#17314A",
    backgroundColor: "#091625",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fileIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#0B2946",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: "#EAF3FF",
    fontSize: 13,
    fontWeight: "800",
  },
  fileMeta: {
    color: "#657D97",
    fontSize: 9,
    marginTop: 5,
  },
  aiReady: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },
  aiReadyText: {
    color: "#4FC5F8",
    fontSize: 9,
    fontWeight: "700",
  },
  delete: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#26151B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  tip: {
    flexDirection: "row",
    gap: 11,
    backgroundColor: "#091A2A",
    borderWidth: 1,
    borderColor: "#163A56",
    borderRadius: 17,
    padding: 15,
    marginTop: 15,
  },
  tipTitle: {
    color: "#DDEEFF",
    fontSize: 12,
    fontWeight: "800",
  },
  tipText: {
    color: "#7189A2",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },
});



