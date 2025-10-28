import { fakeTimekeepings } from "@/models/data/timekeepingData";
import { LegacyTimekeepingStatus } from "@/models/timesheet/timekeeping";
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
import TimekeepingModal from "./TimekeepingModal";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const TimesheetWeek = () => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedTimekeepingId, setSelectedTimekeepingId] = useState<number>(0);
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

      // Determine status display based on timekeeping status
      let statusDisplay: string | number = "N";
      let statusColor = "#8C8F92";
      let timekeepingId = 0;
      let isPending = false;

      if (timekeeping) {
        timekeepingId = timekeeping.timekeepingId;
        if (timekeeping.status === LegacyTimekeepingStatus.PENDING) {
          statusDisplay = "0";
          statusColor = "#1976D2";
          isPending = true;
        } else if (timekeeping.status === LegacyTimekeepingStatus.END) {
          statusDisplay = timekeeping.totalWorkHour;
          statusColor = "#00A854";
        } else if (timekeeping.status === LegacyTimekeepingStatus.NOT_WORK) {
          statusDisplay = "N";
          statusColor = "#8C8F92";
        }
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
  console.log(weekData);

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
          <TouchableOpacity
            key={index}
            style={[styles.dayCard, item.isPending && styles.activeCard]}
            onPress={() => {
              if (item.timekeepingId !== 0) {
                setSelectedTimekeepingId(item.timekeepingId);
              }
            }}
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

              {item.timeRange ? (
                <View style={styles.detailsRow}>
                  <Text style={styles.timeText}>{item.timeRange}</Text>
                  {item.hasOT ? (
                    <View style={styles.otBadge}>
                      <Text style={styles.otText}>★</Text>
                    </View>
                  ) : (
                    <View style={[styles.otBadge, { backgroundColor: "#fff" }]}>
                      <Text style={[styles.otText, { fontSize: 0 }]}></Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.detailsRow}>
                  <Text style={styles.timeText}>_ _ : _ _ - _ _ : _ _</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
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
  dayCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activeCard: {
    backgroundColor: "#E3F2FD",
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "space-around",
    minWidth: 60,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    color: "#7A7A7A",
  },
  divider: {
    width: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 15,
    color: "#7A7A7A",
    marginRight: 8,
  },
  otBadge: {
    backgroundColor: "#FBC02D",
    borderRadius: 25,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  otText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
