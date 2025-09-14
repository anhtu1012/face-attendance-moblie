import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { selectAuthLogin } from "../../../lib/features/loginSlice";

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const auth = useSelector(selectAuthLogin);

  useEffect(() => {
    console.log("HomePage mounted", auth);

    if (auth?.userProfile) {
      console.log("User from Redux:", auth.userProfile);
    }
  }, [auth]);

  const quickActions = [
    {
      title: "Chấm công",
      icon: "clock-circle",
      color: "#4CAF50",
      onPress: () => router.push("/timesheet" as any),
    },
    {
      title: "Tạo đơn",
      icon: "form",
      color: "#2196F3",
      onPress: () => router.push("/(drawer)/(tabs)/create-form" as any),
    },
    {
      title: "Bảng lương",
      icon: "dollar-circle",
      color: "#FF9800",
      onPress: () => router.push("/(drawer)/(tabs)/salary" as any),
    },
    {
      title: "Thông báo",
      icon: "bell",
      color: "#F44336",
      onPress: () => router.push("/(drawer)/notifications" as any),
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Simulate API call to refresh dashboard data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Thành công", "Dữ liệu trang chủ đã được cập nhật!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
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
    >
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <Text style={styles.headerTitle}>Chào mừng trở lại!</Text>
        <Text style={styles.headerSubtitle}>Hệ thống chấm công thông minh</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Thao tác nhanh</Text>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <LinearGradient
                colors={[action.color, `${action.color}CC`]}
                style={styles.quickActionIcon}
              >
                <AntDesign name={action.icon as any} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Thống kê hôm nay</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="access-time" size={32} color="#4CAF50" />
              <Text style={styles.statValue}>8h 15m</Text>
              <Text style={styles.statLabel}>Thời gian làm việc</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="check-circle" size={32} color="#2196F3" />
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Đơn đã duyệt</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <AntDesign name="clock-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Chấm công vào</Text>
              <Text style={styles.activityTime}>08:00 - Hôm nay</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <AntDesign name="form" size={20} color="#2196F3" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Đơn xin nghỉ phép</Text>
              <Text style={styles.activityTime}>Đã duyệt - Hôm qua</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 45,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
  },
});
