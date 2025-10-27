import { Timekeeping } from "@/models/timesheet/timekeeping";
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

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const TimesheetWeek = () => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());

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
  }, [currentWeek]);

  // Map timekeeping data to week days
  const weekData = useMemo(() => {
    return weekDays.map((day, index) => {
      const dateString = day.format("YYYY-MM-DD");
      const timekeeping = fakeTimekeepings.find((t) => t.date === dateString);

      // Determine status display
      let statusDisplay: string | number = "N";
      let statusColor = "#8C8F92";

      if (timekeeping) {
        if (timekeeping.status === "PENDING") {
          statusDisplay = "0";
          statusColor = "#1976D2";
        } else if (timekeeping.status === "END") {
          statusDisplay = timekeeping.totalWorkHour;
          statusColor = "#00A854";
        } else if (timekeeping.status === "NOT_WORK") {
          statusDisplay = "N";
          statusColor = "#8C8F92";
        }
      }

      // Day name
      const dayNames = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
      const dayName = dayNames[index];

      return {
        date: day.format("DD/MM"),
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
        isToday: day.isSame(dayjs(), "day"),
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
          <ChevronLeft color="#3674B5" size={24} />
        </TouchableOpacity>

        <Text style={styles.weekTitle}>{weekRange}</Text>

        <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
          <ChevronRight color="#3674B5" size={24} />
        </TouchableOpacity>
      </View>

      {/* Week List */}
      <ScrollView style={styles.scrollView}>
        {weekData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayCard, item.isToday && styles.activeCard]}
          >
            {/* Left: Day & Date */}
            <View style={styles.leftSection}>
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Right: Status & Details */}
            <View style={styles.rightSection}>
              <Text style={[styles.statusText, { color: item.statusColor }]}>
                {item.status}
              </Text>

              {item.timeRange && (
                <View style={styles.detailsRow}>
                  <Text style={styles.timeText}>{item.timeRange}</Text>
                  {item.hasOT && (
                    <View style={styles.otBadge}>
                      <Text style={styles.otText}>★</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TimesheetWeek;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  dayCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activeCard: {
    backgroundColor: "#E3F2FD",
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#7A7A7A",
  },
  divider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
  },
  statusText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#7A7A7A",
    marginRight: 8,
  },
  otBadge: {
    backgroundColor: "#FBC02D",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  otText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

// Fake data - giống TimesheetCalendar
const fakeTimekeepings: Timekeeping[] = [
  {
    timekeepingId: 1,
    date: "2025-10-26",
    totalWorkHour: 0,
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "PENDING",
  },
  {
    timekeepingId: 2,
    date: "2025-10-25",
    totalWorkHour: 8,
    checkinTime: "08:00",
    checkoutTime: "12:00",
    hasOT: false,
    status: "END",
  },
  {
    timekeepingId: 3,
    date: "2025-10-24",
    totalWorkHour: 10.0,
    checkinTime: "07:30",
    checkoutTime: "18:00",
    hasOT: true,
    status: "END",
  },
  {
    timekeepingId: 4,
    date: "2025-10-23",
    totalWorkHour: 8,
    checkinTime: "08:00",
    checkoutTime: "17:00",
    hasOT: false,
    status: "END",
  },
  {
    timekeepingId: 5,
    date: "2025-10-22",
    totalWorkHour: 8,
    checkinTime: "08:00",
    checkoutTime: "17:00",
    hasOT: false,
    status: "END",
  },
  {
    timekeepingId: 6,
    date: "2025-10-21",
    totalWorkHour: 8,
    checkinTime: "09:15",
    checkoutTime: "17:00",
    hasOT: false,
    status: "END",
  },
  {
    timekeepingId: 7,
    date: "2025-10-20",
    totalWorkHour: 8.5,
    checkinTime: "08:30",
    checkoutTime: "17:30",
    hasOT: true,
    status: "END",
  },
  {
    timekeepingId: 8,
    date: "2025-10-19",
    totalWorkHour: 8,
    checkinTime: "08:00",
    checkoutTime: "17:00",
    hasOT: false,
    status: "END",
  },
];
