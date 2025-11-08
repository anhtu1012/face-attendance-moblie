import { useGetDetailTimekeepingData } from "@/hooks/useGetDetailTimekeepingData";
import { useGetTimekeepingData } from "@/hooks/useGetTimekeepingData";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
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
import { useIsFocused } from "@react-navigation/native";
interface TodayWidgetProps {
  loadingSchedule: boolean;
}

const TodayWidget = ({ loadingSchedule }: TodayWidgetProps) => {
  // Pulse animation for check-in button
  const pulse = useSharedValue(1);
  const { userId } = useGetUserProfile();
  const isFocused = useIsFocused();
  const today = new Date();
  console.log("today: ", today);

  const yesterday = new Date(today);

  // set yesterday
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(17, 0, 0, 0);

  // set Today
  today.setUTCHours(23, 59, 59, 0);

  const {
    timekeepingData,
    timekeepingError,
    isLoading: isLoadingTimekeeping,
  } = useGetTimekeepingData({
    startTime: yesterday.toISOString(),
    endTime: today.toISOString(),
    userId: userId!,
  });
  console.log("timekeeping: ", timekeepingData);

  const timekeepingId = timekeepingData?.data[0]?.timekeepingId;

  const {
    detailTimekeepingData: todayTimekeepingData,
    detailTimekeepingError,
    refetch,
    isLoading,
    isFetching,
  } = useGetDetailTimekeepingData({
    timekeepingId: timekeepingId || "",
    enabled: !!timekeepingId,
  });
  console.log("today: ", todayTimekeepingData);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.08, { duration: 800 }), -1, true);
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // Lấy ngày hiện tại theo định dạng chuẩn
  const getCurrentDateString = () => {
    const today = new Date();
    // Trả về ngày hiện tại theo định dạng YYYY-MM-DD
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  // Format date to Thứ X, DD/MM/YYYY
  const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loadingSchedule || isLoadingTimekeeping || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải lịch làm việc...</Text>
      </View>
    );
  }

  if (!todayTimekeepingData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có lịch làm việc cho hôm nay</Text>
      </View>
    );
  }
  // Sử dụng phương thức getCurrentDateString để lấy ngày hiện tại
  const currentDateString = getCurrentDateString();
  // Xác định trạng thái check-in
  let checkInButtonText = "Chấm công";
  let checkInButtonDisabled = false;
  let checkInButtonColor = "#3674B5";
  let checkInTime = null;
  let checkOutTime = null;
  if (todayTimekeepingData.checkinTime) {
    checkInTime = todayTimekeepingData.checkinTime;
  }

  if (todayTimekeepingData.checkoutTime) {
    checkOutTime = todayTimekeepingData.checkoutTime;
  }

  return (
    <View style={styles.todayContainer}>
      <View style={styles.todayHeader}>
        <View style={{ flexDirection: "row", gap: "10%" }}>
          <AntDesign name="calendar" size={24} color="#3674B5" />
          <View>
            <Text style={styles.currentDate}>
              {formatDateWithDay(currentDateString)}
            </Text>
            <Text style={styles.shiftTime}>
              {todayTimekeepingData?.shiftInfor?.shiftStartTime
                ? todayTimekeepingData.shiftInfor.shiftStartTime
                : ""}{" "}
              -{" "}
              {todayTimekeepingData?.shiftInfor?.shiftEndTime
                ? todayTimekeepingData.shiftInfor.shiftEndTime
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.attendanceActions}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              style={[
                styles.checkinButton,
                { backgroundColor: checkInButtonColor },
              ]}
              disabled={checkInButtonDisabled}
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
              activeOpacity={0.8}
            >
              <Text style={styles.checkinText}>{checkInButtonText}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      {/* content */}

      <View style={styles.attendanceDetails}>
        <CheckTimeBox
          type="in"
          time={todayTimekeepingData.checkinTime!}
          checkinStatus={todayTimekeepingData.checkinStatus!}
          checkoutStatus={todayTimekeepingData.checkoutStatus!}
        />
        <CheckTimeBox
          type="out"
          time={todayTimekeepingData.checkoutTime!}
          checkinStatus={todayTimekeepingData.checkinStatus!}
          checkoutStatus={todayTimekeepingData.checkoutStatus!}
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timeDetailCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  shiftTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  attendanceActions: {
    alignItems: "center",
  },
  checkinButton: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  checkinText: {
    color: "#fff",
    fontWeight: "600",
  },
  checkinStatus: {
    fontSize: 12,
    color: "#F57C00",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  attendanceDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  timeDetailCard: {
    borderRadius: 16,
    padding: 14,
    flex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Check-in card styles (Green theme)
  checkInCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1.5,
    borderColor: "#A7F3D0",
  },
  checkInTitle: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },
  checkInIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  checkInValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 4,
    paddingBottom: 6,
  },
  checkInDashes: {
    fontSize: 20,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 4,
    paddingBottom: 6,
  },
  checkInStatus: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Check-out card styles (Orange theme)
  checkOutCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1.5,
    borderColor: "#FCD34D",
  },
  checkOutTitle: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "600",
  },
  checkOutIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  checkOutValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F59E0B",
    marginBottom: 4,
    paddingBottom: 6,
  },
  checkOutDashes: {
    fontSize: 20,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 4,
    paddingBottom: 6,
  },
  checkOutStatus: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Working hours card styles (Purple theme)
  workingHoursCard: {
    borderRadius: 16,
    padding: 14,
    flex: 1,
    backgroundColor: "#FAF5FF",
    borderWidth: 1.5,
    borderColor: "#C4B5FD",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workingHoursHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  workingHoursTitle: {
    fontSize: 12,
    color: "#581C87",
    fontWeight: "600",
  },
  workingHoursIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  workingHoursContent: {
    alignItems: "center",
    marginBottom: 6,
  },
  workingHoursNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#8B5CF6",
    textAlign: "center",
    lineHeight: 32,
  },
  workingHoursUnit: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
    marginTop: -2,
  },
  workingHoursStatus: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default TodayWidget;
