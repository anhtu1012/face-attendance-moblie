import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
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

  // Sử dụng Mozilla PDF.js viewer
  const getPDFViewerUrl = () => {
    const encodedUrl = encodeURIComponent(pdfUrl);
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodedUrl}`;
  };

  // Mở PDF trong browser ngoài
  const handleOpenInBrowser = () => {
    Linking.openURL(pdfUrl).catch(() => {
      Alert.alert("Lỗi", "Không thể mở file PDF");
    });
  };
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Modern Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.pdfIconContainer}>
                <Feather name="file-text" size={20} color="#3674B5" />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.subtitle}>Xem trước PDF</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleOpenInBrowser}
                style={styles.actionButton}
              >
                <Feather name="external-link" size={20} color="#3674B5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {pdfUrl === "" ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="file" size={48} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>Không có file</Text>
              <Text style={styles.emptyDescription}>
                Không tìm thấy tài liệu để hiển thị
              </Text>
            </View>
          ) : (
            <View style={styles.pdfContainer}>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingCard}>
                    <ActivityIndicator size="large" color="#3674B5" />
                    <Text style={styles.loadingTitle}>Đang tải tài liệu</Text>
                    <Text style={styles.loadingSubtitle}>Vui lòng đợi...</Text>
                    <View style={styles.loadingBar}>
                      <View style={styles.loadingBarFill} />
                    </View>
                  </View>
                </View>
              )}

              <WebView
                source={{
                  uri: getPDFViewerUrl(),
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
                  Alert.alert(
                    "Không thể tải PDF",
                    "Tài liệu không thể hiển thị. Bạn có muốn mở trong trình duyệt không?",
                    [
                      {
                        text: "Mở trình duyệt",
                        onPress: handleOpenInBrowser,
                      },
                      {
                        text: "Đóng",
                        style: "cancel",
                      },
                    ]
                  );
                }}
                javaScriptEnabled
                domStorageEnabled
                cacheEnabled={false}
                originWhitelist={["*"]}
                mixedContentMode="always"
                allowFileAccess
                allowUniversalAccessFromFileURLs
              />
            </View>
          )}

          {/* Modern Footer */}
          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <Feather name="info" size={14} color="#9CA3AF" />
              <Text style={styles.footerText}>
                Kéo xuống để đóng • Nhấn icon để mở trình duyệt
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: "100%",
    height: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden",
  },

  // Modern Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  pdfIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    padding: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // PDF Container
  pdfContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F9FAFB",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },

  // Loading State
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 1,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 200,
  },
  loadingTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  loadingSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#9CA3AF",
  },
  loadingBar: {
    width: 160,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginTop: 20,
    overflow: "hidden",
  },
  loadingBarFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#3674B5",
    borderRadius: 2,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  // WebView
  webview: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

export default PDFModal;
