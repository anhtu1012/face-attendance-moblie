import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function FormDetailScreen() {
  const params = useLocalSearchParams();
  const formData = params as unknown as any;
  const isFocused = useIsFocused();
  const [imageStates, setImageStates] = useState<{
    [key: number]: "loading" | "loaded" | "error";
  }>({});

  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getStatusConfig = () => {
    if (formData.status === "PENDING") {
      return {
        color: "#FF9800",
        backgroundColor: "#FFF4E6",
        icon: "clock-circle",
        text: "Chờ duyệt",
        dotColor: "#FF9800",
      };
    } else if (formData.status === "REJECTED") {
      return {
        color: "#F44336",
        backgroundColor: "#FFEBEE",
        icon: "close-circle",
        text: "Từ chối",
        dotColor: "#F44336",
      };
    } else if (formData.status === "INACTIVE") {
      return {
        color: "#FFFFFF",
        backgroundColor: "#c3c3c3",
        icon: "close-circle",
        text: "Đã hủy",
        dotColor: "#c3c3c3",
      };
    }
    return {
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
      icon: "check-circle",
      text: "Đã duyệt",
      dotColor: "#4CAF50",
    };
  };

  const statusConfig = getStatusConfig();

  console.log("formData: ", formData.file.split(",")[0]);

  // Image Viewer Helpers
  const images = formData.file
    ? formData.file.split(",").map((path: string) => {
        let cleanPath = path.trim();
        if (cleanPath.startsWith("http://")) {
          cleanPath = cleanPath.replace("http://", "https://");
        }
        return cleanPath;
      })
    : [];

  const handleOpenImage = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerVisible(true);
  };

  const handleCloseImage = () => {
    setIsImageViewerVisible(false);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  };

  return (
    <View style={styles.container}>
      {/* Modern White Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Chi tiết đơn</Text>
            <Text style={styles.headerSubtitle}>
              {formData.formCategoryTitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: statusConfig.backgroundColor },
          ]}
        >
          <View style={styles.statusIconContainer}>
            <AntDesign
              name={statusConfig.icon as any}
              size={32}
              color={statusConfig.color}
            />
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Trạng thái đơn</Text>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="#3674B5"
            />
            <Text style={styles.cardTitle}>Thông tin chung</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <AntDesign name="calendar" size={16} color="#666" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Ngày gửi</Text>
                <Text style={styles.infoValue}>
                  {new Date(formData.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <AntDesign name="calendar" size={16} color="#666" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Ngày bắt đầu</Text>
                <Text style={styles.infoValue}>
                  {new Date(formData.startTime).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <AntDesign name="calendar" size={16} color="#666" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Ngày kết thúc</Text>
                <Text style={styles.infoValue}>
                  {new Date(formData.endTime).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* People Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="team" size={20} color="#3674B5" />
            <Text style={styles.cardTitle}>Người liên quan</Text>
          </View>

          <View style={styles.peopleContainer}>
            <View style={styles.personItem}>
              <View style={styles.personIconContainer}>
                <AntDesign name="user" size={18} color="#3674B5" />
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personLabel}>Người gửi</Text>
                <Text style={styles.personName}>{formData.submittedName}</Text>
              </View>
            </View>

            <View style={styles.dividerHorizontal} />

            <View style={styles.personItem}>
              <View style={styles.personIconContainer}>
                <AntDesign name="check-square" size={18} color="#4CAF50" />
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personLabel}>Người duyệt</Text>
                <Text style={styles.personName}>
                  {formData.approvedName || "Chưa duyệt"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reason Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Octicons name="file" size={20} color="#3674B5" />
            <Text style={styles.cardTitle}>Lý do</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{formData.reason}</Text>
          </View>
        </View>

        {/* Response Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="message-reply-text"
              size={20}
              color="#3674B5"
            />
            <Text style={styles.cardTitle}>Phản hồi</Text>
          </View>
          <View style={styles.contentBox}>
            {formData.response ? (
              <Text style={styles.contentText}>{formData.response}</Text>
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="message-off"
                  size={32}
                  color="#ccc"
                />
                <Text style={styles.emptyText}>Chưa có phản hồi</Text>
              </View>
            )}
          </View>
        </View>

        {/* File Card */}
        {formData.file && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="paperclip" size={20} color="#3674B5" />
              <Text style={styles.cardTitle}>Tệp đính kèm</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 8,
              }}
            >
              {images.map((cleanPath: string, index: number) => {
                console.log(`🖼️ Loading image ${index}:`, cleanPath);

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: "30%",
                      aspectRatio: 1,
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: "#f0f0f0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => handleOpenImage(index)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: cleanPath }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={200}
                      cachePolicy="none"
                      onLoadStart={() => {
                        console.log(`⏳ Image ${index} loading started`);
                        setImageStates((prev) => ({
                          ...prev,
                          [index]: "loading",
                        }));
                      }}
                      onLoad={() => {
                        console.log(`✅ Image ${index} loaded successfully`);
                        setImageStates((prev) => ({
                          ...prev,
                          [index]: "loaded",
                        }));
                      }}
                      onError={(error) => {
                        console.error(`❌ Image ${index} error:`, error);
                        console.error(`URL was:`, cleanPath);
                        setImageStates((prev) => ({
                          ...prev,
                          [index]: "error",
                        }));
                      }}
                    />
                    {imageStates[index] === "loading" && (
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(0,0,0,0.1)",
                        }}
                      >
                        <ActivityIndicator size="small" color="#3674B5" />
                      </View>
                    )}
                    {imageStates[index] === "error" && (
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffe0e0",
                          padding: 8,
                        }}
                      >
                        <Feather
                          name="alert-circle"
                          size={20}
                          color="#F44336"
                        />
                        <Text
                          style={{
                            fontSize: 9,
                            color: "#F44336",
                            marginTop: 4,
                            textAlign: "center",
                          }}
                        >
                          404
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal
        visible={isImageViewerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseImage}
      >
        <View style={styles.imageViewerContainer}>
          <View style={styles.imageViewerOverlay} />
          <TouchableOpacity
            style={styles.imageViewerCloseButton}
            onPress={handleCloseImage}
          >
            <AntDesign name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageViewerContent}>
             <Image
                source={{ uri: images[selectedImageIndex] }}
                style={{ width: "100%", height: "80%" }}
                contentFit="contain"
            />
          </View>
            
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevImage}
              >
                <Feather name="chevron-left" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNextImage}
              >
                <Feather name="chevron-right" size={32} color="#fff" />
              </TouchableOpacity>

              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {selectedImageIndex + 1} / {images.length}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  // Status Card
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    marginBottom: 4,
    fontWeight: "600",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 10,
  },
  // Info Grid
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 2,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "600",
  },
  // People
  peopleContainer: {
    gap: 16,
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  personIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  personInfo: {
    flex: 1,
  },
  personLabel: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 2,
    fontWeight: "500",
  },
  personName: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  // Content Box
  contentBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    minHeight: 80,
  },
  contentText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
    fontStyle: "italic",
    fontWeight: "500",
  },
  bottomSpace: {
    height: 40,
  },
  // Image Viewer Styles
  imageViewerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  imageViewerContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerCloseButton: {
    position: "absolute",
    top: 48,
    right: 24,
    zIndex: 10000,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    zIndex: 10000,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  imageCounter: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  imageCounterText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
