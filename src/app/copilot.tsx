import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { fetch as expoFetch } from "expo/fetch";
import {
  ArrowLeft,
  Send,
  Paperclip,
  X,
  Trash2,
  Sparkles,
  FileText,
} from "lucide-react-native";
import BottomNav from "../components/BottomNav";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://classpilot-sen1.onrender.com";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Attachment = {
  uri: string;
  name: string;
  mimeType?: string;
};

export default function CopilotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm ClassPilot AI. Ask me anything about teaching, your syllabus, lesson planning, assessments, or student learning.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  async function pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          "text/plain",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setAttachment({
        uri: asset.uri,
        name: asset.name || "document",
        mimeType: asset.mimeType,
      });
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert("Attachment Error", "Unable to select this document.");
    }
  }

  function removeAttachment() {
    setAttachment(null);
  }

  async function sendMessage() {
    const question = input.trim();

    if (!question && !attachment) return;
    if (loading) return;

    const currentAttachment = attachment;
    const displayQuestion =
      question || "Please analyze this document.";

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      text: currentAttachment
        ? `${displayQuestion}\n\n?? ${currentAttachment.name}`
        : displayQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachment(null);
    setLoading(true);

    try {
      let response: Response;

      if (currentAttachment) {
        const file = new File(currentAttachment.uri);
        const formData = new FormData();

        formData.append("message", displayQuestion);
        formData.append("file", file as any);

        response = await expoFetch(
          `${API_URL}/api/chat/document`,
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        response = await expoFetch(
          `${API_URL}/api/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: displayQuestion,
            }),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "ClassPilot AI request failed."
        );
      }

      const answer =
        data?.reply ||
        data?.response ||
        data?.text ||
        "I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: answer,
        },
      ]);
    } catch (error: any) {
      console.error("ClassPilot AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text:
            error?.message ||
            "I couldn't read that document or connect to ClassPilot AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Hi! I'm ClassPilot AI. Ask me anything about teaching, your syllabus, lesson planning, assessments, or student learning.",
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View
        style={[
          styles.safeTop,
          { paddingTop: insets.top + 8 },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.replace("/teacher-dashboard")}
          >
            <ArrowLeft size={21} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.aiIcon}>
              <Sparkles size={17} color="#FFFFFF" />
            </View>

            <View>
              <Text style={styles.headerTitle}>
                ClassPilot AI
              </Text>

              <Text style={styles.headerSubtitle}>
                Teaching Copilot
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.iconButton}
            onPress={clearChat}
          >
            <Trash2 size={19} color="#AAB7CA" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.role === "user" &&
                styles.userMessageRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.role === "user"
                  ? styles.userBubble
                  : styles.aiBubble,
              ]}
            >
              {message.role === "assistant" && (
                <View style={styles.aiLabelRow}>
                  <Sparkles size={13} color="#42B8FF" />
                  <Text style={styles.aiLabel}>
                    CLASS PILOT AI
                  </Text>
                </View>
              )}

              <Text
                style={[
                  styles.messageText,
                  message.role === "user" &&
                    styles.userMessageText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.messageRow}>
            <View style={styles.aiBubble}>
              <View style={styles.aiLabelRow}>
                <Sparkles size={13} color="#42B8FF" />
                <Text style={styles.aiLabel}>
                  CLASS PILOT AI
                </Text>
              </View>

              <View style={styles.loadingRow}>
                <ActivityIndicator
                  size="small"
                  color="#42B8FF"
                />
                <Text style={styles.loadingText}>
                  Analyzing...
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {attachment && (
        <View style={styles.attachmentPreview}>
          <View style={styles.fileIcon}>
            <FileText size={18} color="#42B8FF" />
          </View>

          <View style={styles.fileInfo}>
            <Text
              style={styles.fileName}
              numberOfLines={1}
            >
              {attachment.name}
            </Text>

            <Text style={styles.fileSubtitle}>
              Ready to analyze
            </Text>
          </View>

          <Pressable
            onPress={removeAttachment}
            style={styles.removeAttachment}
          >
            <X size={18} color="#AAB7CA" />
          </Pressable>
        </View>
      )}

      <View
        style={[
          styles.inputArea,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ]}
      >
        <View style={styles.inputContainer}>
          <Pressable
            style={styles.attachButton}
            onPress={pickDocument}
            disabled={loading}
          >
            <Paperclip size={21} color="#7ED7FF" />
          </Pressable>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask ClassPilot AI..."
            placeholderTextColor="#718096"
            multiline
            editable={!loading}
            scrollEnabled
            textAlignVertical="top"
            style={styles.input}
          />

          <Pressable
            style={[
              styles.sendButton,
              loading && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={loading}
          >
            <Send size={19} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <BottomNav />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050B14",
  },

  safeTop: {
    backgroundColor: "#07111F",
  },

  header: {
    height: 62,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#132238",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C1727",
    borderWidth: 1,
    borderColor: "#1A2B42",
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#126B9A",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#72829A",
    fontSize: 11,
    marginTop: 2,
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },

  messageRow: {
    width: "100%",
    marginBottom: 14,
    alignItems: "flex-start",
  },

  userMessageRow: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "88%",
    borderRadius: 18,
    padding: 14,
  },

  aiBubble: {
    backgroundColor: "#0B1625",
    borderWidth: 1,
    borderColor: "#172A40",
    borderTopLeftRadius: 6,
  },

  userBubble: {
    backgroundColor: "#096B9B",
    borderTopRightRadius: 6,
  },

  aiLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 7,
  },

  aiLabel: {
    color: "#42B8FF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  messageText: {
    color: "#DCE6F3",
    fontSize: 14,
    lineHeight: 21,
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  loadingText: {
    color: "#8797AC",
    fontSize: 13,
  },

  attachmentPreview: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#0A1625",
    borderWidth: 1,
    borderColor: "#1C3852",
    flexDirection: "row",
    alignItems: "center",
  },

  fileIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#0D2639",
    alignItems: "center",
    justifyContent: "center",
  },

  fileInfo: {
    flex: 1,
    marginLeft: 10,
  },

  fileName: {
    color: "#E7F1FC",
    fontSize: 13,
    fontWeight: "700",
  },

  fileSubtitle: {
    color: "#6E8198",
    fontSize: 11,
    marginTop: 2,
  },

  removeAttachment: {
    padding: 8,
  },

  inputArea: {
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: "#07111F",
  },

  inputContainer: {
    minHeight: 54,
    maxHeight: 130,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1B3048",
    backgroundColor: "#0A1625",
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 7,
  },

  attachButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 105,
    minHeight: 40,
    paddingHorizontal: 6,
    paddingTop: 9,
    paddingBottom: 9,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#087EB5",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },
});

