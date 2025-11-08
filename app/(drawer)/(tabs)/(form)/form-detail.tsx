import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FormDetail } from "..";
import { useIsFocused } from "@react-navigation/native";

export default function FormDetailScreen() {
  const params = useLocalSearchParams();
  const formData = params as unknown as FormDetail;
  const isFocused = useIsFocused();

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
            <TouchableOpacity style={styles.fileItem} activeOpacity={0.7}>
              <View style={styles.fileIconContainer}>
                <Feather name="file-text" size={20} color="#3674B5" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {formData.file}
                </Text>
                <Text style={styles.fileAction}>Nhấn để xem</Text>
              </View>
              <AntDesign name="right" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
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
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  // Status Card
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "700",
  },
  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 8,
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
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  // People
  peopleContainer: {
    gap: 12,
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  personIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  personInfo: {
    flex: 1,
  },
  personLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
  },
  personName: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 4,
  },
  // Content Box
  contentBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
  },
  contentText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
  },
  // File Item
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  fileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    color: "#3674B5",
    fontWeight: "500",
    marginBottom: 2,
  },
  fileAction: {
    fontSize: 12,
    color: "#999",
  },
  bottomSpace: {
    height: 20,
  },
});
