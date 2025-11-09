import { useGetTimekeepingData } from "@/hooks/useGetTimekeepingData";
import { RootState } from "@/lib/store";
import { LegacyTimekeepingStatus } from "@/models/timesheet/timekeeping";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import TimekeepingModal from "./TimekeepingModal";
import TimesheetWeekCard from "./TimesheetWeekCard";
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const TimesheetWeek = () => {
  const userId = useSelector((state: RootState) => state.auth.userProfile.id);
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedTimekeepingId, setSelectedTimekeepingId] = useState<number>(0);
  const { timekeepingData: timekeepingDataList, refetch } =
    useGetTimekeepingData({
      userId: userId!,
      startTime: currentWeek.startOf("isoWeek").toISOString(),
      endTime: currentWeek.endOf("isoWeek").toISOString(),
    });
  // Tính toán tuần hiện tại
  const weekRange = useMemo(() => {
    const startOfWeek = currentWeek.startOf("isoWeek"); // Bắt đầu từ T.2
    const endOfWeek = currentWeek.endOf("isoWeek"); // Kết thúc CN
    return `Tuần ${startOfWeek.format("DD/M")} - ${endOfWeek.format("DD/M")}`;
  }, [currentWeek]);

  // Generate week days (T.2 -> CN)
  const weekDays = useMemo(() => {
    const startOfWeek = currentWeek.startOf("isoWeek");
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, "day"));
    }
    return days;
  }, [currentWeek, timekeepingDataList]);

  // Map timekeeping data to week days
  const weekData = useMemo(() => {
    return weekDays.map((day, index) => {
      const dateString = day.format("YYYY-MM-DD");
      const timekeeping = timekeepingDataList?.data.find(
        (t: any) => t.date === dateString
      );

      // Determine status display based on timekeeping status
      let statusDisplay: string | number = "N";
      let statusColor = "#8C8F92";
      let timekeepingId = 0;
      let isPending = false;
      const isFutureDate = day.isAfter(dayjs());
      if (timekeeping) {
        timekeepingId = parseInt(timekeeping.timekeepingId);
        if (timekeeping.status === LegacyTimekeepingStatus.PENDING) {
          statusDisplay = "0";
          statusColor = "#1976D2";
          isPending = true;
        } else if (timekeeping.status === LegacyTimekeepingStatus.END_ONTIME) {
          statusDisplay = timekeeping.totalWorkHour;
          statusColor = "#00A854";
        } else if (timekeeping.status === LegacyTimekeepingStatus.NOT_WORK) {
          statusDisplay = "N";
          statusColor = "#8C8F92";
        }
      } else if (isFutureDate) {
        statusDisplay = "0";
        statusColor = "#8C8F92";
      }
      // Day name
      const dayNames = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
      const dayName = dayNames[index];

      return {
        date: day.format("DD/MM"),
        timekeepingId: timekeepingId,
        day: dayName,
        status: statusDisplay,
        statusColor: statusColor,
        timeRange:
          timekeeping?.checkinTime && timekeeping?.checkoutTime
            ? `${timekeeping.checkinTime} - ${timekeeping.checkoutTime}`
            : timekeeping?.checkinTime
            ? `${timekeeping.checkinTime} - _:__`
            : undefined,
        hasOT: timekeeping?.hasOT,
        isPending: isPending,
      };
    });
  }, [weekDays]);


  const handlePrevWeek = () => setCurrentWeek(currentWeek.subtract(1, "week"));
  const handleNextWeek = () => setCurrentWeek(currentWeek.add(1, "week"));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
          <ChevronLeft color="#000" size={26} />
        </TouchableOpacity>

        <Text style={styles.weekTitle}>{weekRange}</Text>

        <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
          <ChevronRight color="#000" size={26} />
        </TouchableOpacity>
      </View>

      {/* Week List */}
      <ScrollView style={styles.scrollView}>
        {weekData.map((item, index) => (
          <TimesheetWeekCard
            key={index}
            item={item}
            setSelectedTimekeepingId={setSelectedTimekeepingId}
          />
        ))}
      </ScrollView>
      <TimekeepingModal
        visible={selectedTimekeepingId !== 0}
        onClose={() => setSelectedTimekeepingId(0)}
        selectedTimekeepingId={selectedTimekeepingId}
      />
    </View>
  );
};

export default TimesheetWeek;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 100,
  },
});
