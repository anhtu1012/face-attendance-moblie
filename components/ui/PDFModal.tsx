import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  isVisible: boolean;
  pdfUrl: string;
  onClose: () => void;
  title: string;
};

const PDFModal = ({ isVisible, pdfUrl, onClose, title }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
  }, [isVisible, title]);
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.pdfContainer}>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3674B5" />
                <Text style={styles.loadingText}>Đang tải PDF...</Text>
              </View>
            )}

            <WebView
              source={{
                uri: pdfUrl.startsWith("http")
                  ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                      pdfUrl
                    )}`
                  : pdfUrl,
              }}
              style={styles.webview}
              onLoadStart={() => {
                console.log("Start loading PDF");
                setIsLoading(true);
              }}
              onLoadProgress={({ nativeEvent }) => {
                if (nativeEvent.progress > 0.7) {
                  setIsLoading(false);
                }
              }}
              onLoadEnd={() => {
                console.log("Finished loading PDF");
                setIsLoading(false);
              }}
              onError={(error) => {
                console.log("WebView error", error);
                setIsLoading(false);
                Alert.alert("Lỗi", "Không thể tải file PDF");
              }}
              javaScriptEnabled
              domStorageEnabled
              cacheEnabled={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    width: "95%",
    height: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  pdfContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  webview: {
    flex: 1,
  },
});

export default PDFModal;
