import { useGetDetailTimekeepingData } from "@/hooks/useGetDetailTimekeepingData";
import { useGetTimekeepingData } from "@/hooks/useGetTimekeepingData";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { TimekeepingStatus } from "@/models/timesheet/timekeeping";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TimesheetTotalHourBox from "../Timekeeping/TimesheetTotalHourBox";
import CheckTimeBox from "../ui/CheckTimeBox";

interface TodayWidgetProps {
  loadingSchedule: boolean;
  refetchCurrentTimekeeping: string;
  isRefresh: boolean;
}

const TodayWidget = ({
  loadingSchedule,
  refetchCurrentTimekeeping,
  isRefresh,
}: TodayWidgetProps) => {
  // Pulse animation for check-in button
  const pulse = useSharedValue(1);
  const { userId } = useGetUserProfile();
  const isFocused = useIsFocused();
  const today = new Date();
  const yesterday = new Date(today);

  // set yesterday
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(17, 0, 0, 0);

  // set Today
  today.setUTCHours(23, 59, 59, 0);

  const {
    timekeepingData,
    isLoading: isLoadingTimekeeping,
    refetch: refetchTodayTimekeepingData,
  } = useGetTimekeepingData({
    startTime: yesterday.toISOString(),
    endTime: today.toISOString(),
    userId: userId || "",
  });
  const timekeepingId = timekeepingData?.data[0]?.timekeepingId;

  const {
    detailTimekeepingData: todayTimekeepingData,
    isLoading,
    refetch: refetchTimekeepingData,
  } = useGetDetailTimekeepingData({
    timekeepingId: timekeepingId || "",
    enabled: !!timekeepingId,
  });

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true);
  }, []);

  // refetch when navigate back from useTimekeeping
  useEffect(() => {
    if (refetchCurrentTimekeeping === "true" || isRefresh) {
      refetchTodayTimekeepingData();
      if (timekeepingId) refetchTimekeepingData();
      router.replace("/(drawer)/(tabs)");
    }
  }, [refetchCurrentTimekeeping, isRefresh]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // Format date to Thứ X, DD/MM/YYYY
  const formatDateWithDay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDay();
    const dayNames = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return `${dayNames[day]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (loadingSchedule || isLoadingTimekeeping || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải dữ liệu chấm công...</Text>
      </View>
    );
  }

  if (!todayTimekeepingData) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyImageWrapper}>
            <Image
            source={require("../../assets/images/day-off.jpg")}
            style={styles.emptyImage}
            />
        </View>
        <Text style={styles.emptyTitle}>Hôm nay bạn được nghỉ!</Text>
        <Text style={styles.emptyText}>
          Tận hưởng ngày nghỉ của bạn nhé.
        </Text>
      </View>
    );
  }

  const isPending =
    todayTimekeepingData.status !== TimekeepingStatus.PENDING &&
    todayTimekeepingData.status !== TimekeepingStatus.START_LATE &&
    todayTimekeepingData.status !== TimekeepingStatus.START_ONTIME;

  const buttonGradientColors = todayTimekeepingData?.checkinTime === null
        ? (["#3B82F6", "#2563EB"] as const) // Blue for Check-in
        : (["#F59E0B", "#D97706"] as const); // Orange for Check-out
  
  const buttonText = todayTimekeepingData?.checkinTime === null ? "Check-in" : "Check-out";

  return (
    <View style={styles.todayContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
             <Text style={styles.dateText}>{formatDateWithDay(todayTimekeepingData.date)}</Text>
             <View style={styles.shiftContainer}>
                <Feather name="clock" size={14} color="#64748B" />
                <Text style={styles.shiftText}>
                    {todayTimekeepingData?.shiftInfor?.shiftStartTime || "--:--"} -{" "}
                    {todayTimekeepingData?.shiftInfor?.shiftEndTime || "--:--"}
                </Text>
                 <View style={styles.shiftBadge}>
                    <Text style={styles.shiftBadgeText}>{todayTimekeepingData?.shiftInfor?.shiftName || "Ca làm việc"}</Text>
                 </View>
             </View>
        </View>
        
        {/* Animated Check-in/out Button */}
        <Animated.View style={!isPending ? animatedButtonStyle : null}>
            <TouchableOpacity
                disabled={isPending}
                onPress={() =>
                    router.push({
                        pathname: "/(drawer)/(tabs)/timekeep-camera",
                        params: {
                        mode:
                            todayTimekeepingData?.checkinTime === null
                            ? "check-in"
                            : "check-out",
                        timekeepingId: todayTimekeepingData?.timeKeepingId,
                        },
                    })
                }
                activeOpacity={0.9}
                style={styles.buttonShadow}
            >
                <LinearGradient
                    colors={isPending ? (["#94A3B8", "#64748B"] as const) : buttonGradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionButton}
                >
                    <MaterialCommunityIcons name="face-recognition" size={20} color="white" />
                    <Text style={styles.actionButtonText}>{buttonText}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.divider} />

      {/* Timekeeping Details */}
      <View style={styles.detailsContainer}>
        <CheckTimeBox
          type="in"
          time={todayTimekeepingData.checkinTime!}
          checkinStatus={todayTimekeepingData.checkInStatus!}
          checkoutStatus={todayTimekeepingData.checkOutStatus!}
          timekeepingStatus={todayTimekeepingData.status}
        />
        <CheckTimeBox
          type="out"
          time={todayTimekeepingData.checkOutTime!}
          checkinStatus={todayTimekeepingData.checkInStatus!}
          checkoutStatus={todayTimekeepingData.checkOutStatus!}
          timekeepingStatus={todayTimekeepingData.status}
        />
        <TimesheetTotalHourBox
          totalWorkHour={todayTimekeepingData.totalWorkHour}
          totalTimekeepingNumber={todayTimekeepingData.totalTimekeepingNumber}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todayContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  shiftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shiftText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  shiftBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shiftBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
  },
  buttonShadow: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
  },
  emptyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});

export default TodayWidget;
