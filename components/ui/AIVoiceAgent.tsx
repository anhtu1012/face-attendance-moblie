import { Feather } from "@expo/vector-icons";
import Voice from "@react-native-voice/voice";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AIVoiceAgentProps = {
  visible: boolean;
  onClose: () => void;
  onFinish: (recognizedText: string) => void;
  title?: string;
};

const AIVoiceAgent: React.FC<AIVoiceAgentProps> = ({
  visible,
  onClose,
  onFinish,
  title = "AI Voice Agent",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const lastPartialRef = useRef("");

  const requestAudioPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setIsLoading(false);
    };
    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };
    Voice.onSpeechResults = (e: any) => {
      const text = e?.value?.[0] ?? "";
      if (text) setRecognizedText(text);
    };
    Voice.onSpeechPartialResults = (e: any) => {
      const text = e?.value?.[0] ?? "";
      lastPartialRef.current = text;
    };
    Voice.onSpeechError = (e: any) => {
      setIsListening(false);
      setIsLoading(false);
      Alert.alert("Lỗi", "Không thể nhận dạng giọng nói. Vui lòng thử lại.");
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setIsListening(false);
      setIsLoading(false);
      setRecognizedText("");
      lastPartialRef.current = "";
    }
  }, [visible]);

  const handleStart = async () => {
    const ok = await requestAudioPermission();
    if (!ok) {
      Alert.alert("Quyền bị từ chối", "Cần quyền microphone để thu âm.");
      return;
    }
    try {
      setIsLoading(true);
      setRecognizedText("");
      lastPartialRef.current = "";
      await Voice.start("vi-VN");
    } catch (e) {
      setIsLoading(false);
      setIsListening(false);
    }
  };

  const handleStop = async () => {
    try {
      await Voice.stop();
    } catch {}
    setIsListening(false);
    setIsLoading(false);
    const finalText = recognizedText || lastPartialRef.current || "";
    onFinish(finalText);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
              <Feather name="x" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.micContainer}>
              <View
                style={[styles.micRing, isListening && styles.micRingActive]}
              />
              <Feather
                name={isListening ? "mic" : "mic"}
                size={48}
                color={isListening ? "#E53E3E" : "#3674B5"}
              />
            </View>
            <Text style={styles.hintText}>
              {isListening ? "Đang lắng nghe..." : "Nhấn Bắt đầu để nói"}
            </Text>
            {!!recognizedText && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>Kết quả tạm thời</Text>
                <Text style={styles.resultText}>{recognizedText}</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.secondaryBtn]}
              onPress={onClose}
            >
              <Text style={styles.secondaryText}>Đóng</Text>
            </TouchableOpacity>

            {!isListening ? (
              <TouchableOpacity
                style={[styles.actionBtn, styles.primaryBtn]}
                onPress={handleStart}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryText}>Bắt đầu</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionBtn, styles.dangerBtn]}
                onPress={handleStop}
              >
                <Text style={styles.primaryText}>Kết thúc</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxWidth: 520,
    maxHeight: "85%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  iconBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  micContainer: {
    alignSelf: "center",
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  micRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  micRingActive: {
    borderColor: "#fecaca",
  },
  hintText: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 12,
  },
  resultBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  resultTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  resultText: {
    fontSize: 14,
    color: "#111827",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryBtn: {
    backgroundColor: "#3674B5",
  },
  dangerBtn: {
    backgroundColor: "#E53E3E",
  },
  secondaryBtn: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#374151",
    fontWeight: "600",
  },
});

export default AIVoiceAgent;
