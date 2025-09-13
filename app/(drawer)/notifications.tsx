import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  // ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
}

export default function NotificationPage() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications: Notification[] = [
    {
      id: "1",
      title: "Đơn xin nghỉ phép được duyệt",
      message: "Đơn xin nghỉ phép ngày 15/11 đã được phê duyệt bởi quản lý.",
      time: "2 giờ trước",
      type: "success",
      isRead: false,
    },
    {
      id: "2",
      title: "Thông báo bảo trì hệ thống",
      message:
        "Hệ thống sẽ được bảo trì vào 23:00 ngày 20/11. Vui lòng chấm công trước thời gian này.",
      time: "1 ngày trước",
      type: "warning",
      isRead: false,
    },
    {
      id: "3",
      title: "Cập nhật chính sách công ty",
      message:
        "Chính sách về giờ làm việc đã được cập nhật. Vui lòng xem chi tiết trong phần tài liệu.",
      time: "2 ngày trước",
      type: "info",
      isRead: true,
    },
    {
      id: "4",
      title: "Chấm công thành công",
      message: "Bạn đã chấm công vào lúc 08:00 ngày 18/11.",
      time: "3 ngày trước",
      type: "success",
      isRead: true,
    },
    {
      id: "5",
      title: "Đơn xin làm thêm giờ",
      message: "Đơn xin làm thêm giờ ngày 17/11 đang chờ phê duyệt.",
      time: "4 ngày trước",
      type: "info",
      isRead: false,
    },
  ];

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return { name: "check-circle", color: "#4CAF50" };
      case "warning":
        return { name: "warning", color: "#FF9800" };
      case "error":
        return { name: "close-circle", color: "#F44336" };
      default:
        return { name: "info-circle", color: "#2196F3" };
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const iconInfo = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadNotification,
        ]}
      >
        <View style={styles.notificationIcon}>
          <AntDesign
            name={iconInfo.name as any}
            size={24}
            color={iconInfo.color}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text
              style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadTitle,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>

          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>

          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <Text style={styles.headerSubtitle}>
          {unreadCount > 0
            ? `${unreadCount} thông báo mới`
            : "Không có thông báo mới"}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === "all" && styles.activeFilterTab,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === "all" && styles.activeFilterTabText,
              ]}
            >
              Tất cả ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === "unread" && styles.activeFilterTab,
            ]}
            onPress={() => setFilter("unread")}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === "unread" && styles.activeFilterTabText,
              ]}
            >
              Chưa đọc ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <FlatList
            data={filteredNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notificationsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>Không có thông báo</Text>
            <Text style={styles.emptyMessage}>
              {filter === "unread"
                ? "Bạn đã đọc hết tất cả thông báo"
                : "Chưa có thông báo nào được gửi đến bạn"}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {unreadCount > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["#4CAF50", "#45a049"]}
                style={styles.actionButtonGradient}
              >
                <MaterialIcons name="done-all" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>
                  Đánh dấu đã đọc tất cả
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  activeFilterTab: {
    backgroundColor: "#3674B5",
  },
  filterTabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  notificationsList: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#3674B5",
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
    position: "relative",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  unreadTitle: {
    fontWeight: "bold",
    color: "#000",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3674B5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 15,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
  actionButtons: {
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
