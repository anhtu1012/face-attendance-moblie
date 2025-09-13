import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Placeholder components for timesheet views
const MonthlyTimesheet = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabTitle}>Công tháng</Text>
    <Text style={styles.tabDescription}>Hiển thị bảng công theo tháng</Text>
  </View>
);

const WeeklyTimesheet = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabTitle}>Công tuần</Text>
    <Text style={styles.tabDescription}>Hiển thị bảng công theo tuần</Text>
  </View>
);

const StatsTimesheet = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabTitle}>Thống kê</Text>
    <Text style={styles.tabDescription}>
      Thống kê giờ làm việc và hiệu suất
    </Text>
  </View>
);

const { width } = Dimensions.get("window");
const TopTab = createMaterialTopTabNavigator();

export default function TimesheetScreen() {
  const insets = useSafeAreaInsets();

  // Navigation handlers
  const handleGoHome = useCallback(() => {
    router.back();
  }, []);

  const handleRefresh = useCallback(() => {
    console.log("Refreshing timesheet data...");
  }, []);

  // Tab icons - memoized
  const renderMonthlyIcon = useCallback(
    ({ color }: { color: string }) => (
      <Feather name="calendar" size={18} color={color} style={styles.tabIcon} />
    ),
    []
  );

  const renderWeeklyIcon = useCallback(
    ({ color }: { color: string }) => (
      <MaterialIcons
        name="view-week"
        size={18}
        color={color}
        style={styles.tabIcon}
      />
    ),
    []
  );

  const renderStatsIcon = useCallback(
    ({ color }: { color: string }) => (
      <Feather
        name="bar-chart-2"
        size={18}
        color={color}
        style={styles.tabIcon}
      />
    ),
    []
  );

  // Tab screen options
  const tabScreenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: "#3674B5",
      tabBarInactiveTintColor: "#666",
      tabBarIndicatorStyle: {
        backgroundColor: "#3674B5",
        height: 3,
      },
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: "500" as const,
        textTransform: "none" as const,
      },
      tabBarItemStyle: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingHorizontal: 10,
      },
      tabBarStyle: {
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        height: 50,
      },
    }),
    []
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#3674B5", "#2196F3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
            <AntDesign name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bảng chấm công</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
            <MaterialIcons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <TopTab.Navigator screenOptions={tabScreenOptions}>
        <TopTab.Screen
          name="MonthlyTimesheet"
          component={MonthlyTimesheet}
          options={{
            tabBarLabel: "Công tháng",
            tabBarIcon: renderMonthlyIcon,
          }}
        />
        <TopTab.Screen
          name="WeeklyTimesheet"
          component={WeeklyTimesheet}
          options={{
            tabBarLabel: "Công tuần",
            tabBarIcon: renderWeeklyIcon,
          }}
        />
        <TopTab.Screen
          name="StatsTimesheet"
          component={StatsTimesheet}
          options={{
            tabBarLabel: "Thống kê",
            tabBarIcon: renderStatsIcon,
          }}
        />
      </TopTab.Navigator>

      {/* Floating Action Button for Clock In/Out */}
      <TouchableOpacity style={styles.clockInButton}>
        <LinearGradient
          colors={["#4CAF50", "#45a049"]}
          style={styles.clockInButtonGradient}
        >
          <Feather name="clock" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerGradient: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  tabDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  clockInButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  clockInButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
