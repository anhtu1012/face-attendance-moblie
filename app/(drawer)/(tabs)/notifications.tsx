import CustomHeaders from "@/components/ui/CustomHeaders";
import { useGetNotificationList } from "@/hooks/useGetNotificationList";
import useSocket from "@/hooks/useSocket";
import {
  dtoNotification,
  NotificationEnum,
  NotificationType,
} from "@/models/notification/dtoNotification";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationsScreen = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [notificationList, setNotificationList] = useState<
    dtoNotification["data"]
  >([]);
  const isFocused = useIsFocused();
  const { notificationList: notificationListData, refetch } =
    useGetNotificationList(isFocused);

  useEffect(() => {
    if (!notificationListData) return;
    setNotificationList(notificationListData);
  }, [notificationListData]);

  const socket = useSocket();

  // Socket listener effect
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not available");
      return;
    }

    console.log("🔌 Setting up socket listener for UPDATE_FORM_STATUS_NOTIFICATION");

    const handleGetSocketData = (data: any) => {
      console.log("📨 Socket message received:", data);
      // Refetch notifications when a new one arrives
      refetch();
    };

    // Add listener
    socket.on("UPDATE_FORM_STATUS_NOTIFICATION", handleGetSocketData);

    // Cleanup listener on unmount
    return () => {
      console.log("🧹 Cleaning up socket listener");
      socket.off("UPDATE_FORM_STATUS_NOTIFICATION", handleGetSocketData);
    };
  }, [socket, refetch]); // Add refetch to dependencies

  // Filter notifications
  const filteredNotifications =
    filter === "all"
      ? notificationList
      : notificationList?.filter((n) => !n.isRead);

  const unreadCount = notificationList
    ? notificationList.filter((n) => !n.isRead).length
    : 0;

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Mark as read
  const markAsRead = (id: string) => {
    // setNotifications((prev) =>
    //   prev?.map((notif) =>
    //     notif.id === id ? { ...notif, isRead: true } : notif,
    //   ),
    // );
  };

  // Mark all as read
  const markAllAsRead = () => {
    // setNotifications((prev) =>
    //   prev?.map((notif) => ({ ...notif, isRead: true })),
    // );
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationEnum) => {
    switch (type) {
      case "SUCCESS":
        return {
          IconComponent: Feather,
          name: "check-circle",
          color: "#4CAF50",
        };
      case "DENY":
        return { IconComponent: Feather, name: "x-circle", color: "#F44336" };
      case "NOTIFICATION":
        return { IconComponent: Feather, name: "info", color: "#3674B5" };
      default:
        return { IconComponent: Feather, name: "volume-2", color: "#9C27B0" };
    }
  };

  // Render notification item
  const renderNotificationItem = ({ item }: { item: NotificationType }) => {
    const iconInfo = getNotificationIcon(item.type);
    const IconComponent = iconInfo.IconComponent;

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        {/* Left colored bar for unread */}
        {!item.isRead && <View style={styles.unreadBar} />}

        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconInfo.color + "15" },
          ]}
        >
          <IconComponent
            name={iconInfo.name as any}
            size={24}
            color={iconInfo.color}
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadTitle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.footerRow}>
            <Feather name="clock" size={12} color="#999" />
            <Text style={styles.notificationTime}>
              {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather name="bell-off" size={64} color="#BDBDBD" />
      </View>
      <Text style={styles.emptyTitle}>
        {filter === "unread" ? "Không có thông báo mới" : "Chưa có thông báo"}
      </Text>
      <Text style={styles.emptyMessage}>
        {filter === "unread"
          ? "Bạn đã đọc tất cả thông báo"
          : "Bạn sẽ nhận được thông báo tại đây"}
      </Text>
    </View>
  );

  // Render list header
  const renderListHeader = () => (
    <View style={styles.listHeader}>
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "all" && styles.activeFilterTabText,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "unread" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("unread")}
        >
          <View style={styles.filterTabContent}>
            <Text
              style={[
                styles.filterTabText,
                filter === "unread" && styles.activeFilterTabText,
              ]}
            >
              Chưa đọc
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Feather name="check-circle" size={16} color="#3674B5" />
          <Text style={styles.markAllText}>Đánh dấu đã đọc tất cả</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeaders title="Thông báo" onBack={() => router.back()} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.bellIconContainer}>
              <Feather name="bell" size={28} color="#3674B5" />
              {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <Text style={styles.headerTitle}>Thông báo</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : "Không có thông báo mới"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Notifications list */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3674B5"]}
            tintColor="#3674B5"
          />
        }
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  // Header styles
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bellIconContainer: {
    position: "relative",
  },
  headerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  // List styles
  listContent: {
    paddingBottom: 20,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  // Filter styles
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  activeFilterTab: {
    backgroundColor: "#3674B5",
  },
  filterTabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterTabText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
  activeFilterTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  badge: {
    backgroundColor: "#fff",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#3674B5",
    fontSize: 11,
    fontWeight: "700",
  },
  // Mark all button
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  markAllText: {
    color: "#3674B5",
    fontSize: 14,
    fontWeight: "600",
  },
  // Notification card styles
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    position: "relative",
    overflow: "hidden",
  },
  unreadNotification: {
    elevation: 2,
    shadowOpacity: 0.08,
    borderLeftWidth: 0,
  },
  unreadBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#3674B5",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "700",
    color: "#000",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3674B5",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
