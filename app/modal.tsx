import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ModalData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info" | "error";
}

export default function ModalScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<ModalData[]>([
    {
      id: "1",
      title: "Thông báo hệ thống",
      description: "Hệ thống đã được cập nhật thành công",
      timestamp: "2 phút trước",
      status: "success",
    },
    {
      id: "2",
      title: "Cảnh báo bảo trì",
      description: "Hệ thống sẽ bảo trì vào 23:00 hôm nay",
      timestamp: "1 giờ trước",
      status: "warning",
    },
    {
      id: "3",
      title: "Thông tin mới",
      description: "Có tính năng mới được thêm vào ứng dụng",
      timestamp: "2 giờ trước",
      status: "info",
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random error (20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Không thể tải dữ liệu. Vui lòng thử lại.");
      }

      // Add new mock data
      const newItem: ModalData = {
        id: Date.now().toString(),
        title: "Dữ liệu mới",
        description: `Đã cập nhật lúc ${new Date().toLocaleTimeString()}`,
        timestamp: "Vừa xong",
        status: "info",
      };

      setData((prevData) => [newItem, ...prevData]);

      Alert.alert("Thành công", "Dữ liệu đã được cập nhật!");
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Lỗi", err.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return { name: "check-circle", color: "#4CAF50" };
      case "warning":
        return { name: "warning", color: "#FF9800" };
      case "error":
        return { name: "error", color: "#F44336" };
      default:
        return { name: "info", color: "#2196F3" };
    }
  };

  const handleItemPress = (item: ModalData) => {
    Alert.alert(item.title, item.description, [
      { text: "Đóng", style: "cancel" },
      {
        text: "Chi tiết",
        onPress: () => console.log("View details:", item.id),
      },
    ]);
  };

  const handleGoHome = () => {
    router.dismiss();
  };

  return (
    <View style={[styles.container]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleGoHome}>
          <AntDesign name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modal Demo</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <MaterialIcons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3674B5"]}
            tintColor="#3674B5"
            title="Đang tải..."
            titleColor="#3674B5"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pullToRefreshHint}>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
          <Text style={styles.hintText}>Kéo xuống để làm mới</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={["#4CAF50", "#45a049"]}
                style={styles.statIcon}
              >
                <MaterialIcons name="notifications" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.statValue}>{data.length}</Text>
              <Text style={styles.statLabel}>Thông báo</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["#2196F3", "#1976D2"]}
                style={styles.statIcon}
              >
                <MaterialIcons name="access-time" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.statValue}>
                {refreshing ? "..." : new Date().getHours()}h
              </Text>
              <Text style={styles.statLabel}>Giờ hiện tại</Text>
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Danh sách thông báo</Text>

          {data.map((item) => {
            const statusIcon = getStatusIcon(item.status);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.itemIcon}>
                  <MaterialIcons
                    name={statusIcon.name as any}
                    size={20}
                    color={statusIcon.color}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
                </View>
                <AntDesign name="right" size={16} color="#ccc" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
            <LinearGradient
              colors={["#FF9800", "#F57C00"]}
              style={styles.actionButtonGradient}
            >
              <MaterialIcons name="refresh" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Làm mới dữ liệu</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
  },
  pullToRefreshHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  hintText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#c62828",
    marginLeft: 10,
  },
  retryButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  listContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  itemTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  actionSection: {
    padding: 20,
    backgroundColor: "#fff",
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
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
