import { fakeTimekeepings } from "@/models/data/timekeepingData";
import { LegacyTimekeepingStatus } from "@/models/timesheet/timekeeping";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TimekeepingBox from "./TimekeepingBox";
import TimekeepingModal from "./TimekeepingModal";
import TimesheetNotes from "./TimesheetNotes";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("vi");

export default function TimesheetCalendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedTimekeepingId, setSelectedTimekeepingId] = useState<number>(0);

  // Generate calendar days with timekeeping data
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = endOfMonth.date();
    const firstDayIndex = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const daysArray: (dayjs.Dayjs | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = startOfMonth.date(day);
      daysArray.push(date);
    }

    // Add empty cells to complete the grid
    while (daysArray.length % 7 !== 0) daysArray.push(null);

    return daysArray;
  }, [currentMonth]);

  // Map calendar days to data with timekeeping info
  const calendarData = useMemo(() => {
    return calendarDays.map((date) => {
      if (!date) return null;

      const dateString = date.format("YYYY-MM-DD");
      const timekeeping = fakeTimekeepings.find((t) => t.date === dateString);
      const isNotCurrentMonth = date.month() !== currentMonth.month();
      const today = dayjs().startOf("day");
      const isFutureDate = date.isAfter(today);

      let backgroundColor = "#FFFFFF";
      let totalWorkHourColor = "#8C8F92";
      let displayValue: string | number = "N";
      let timekeepingId = 0;

      if (isNotCurrentMonth) {
        backgroundColor = "#F8F8F8";
        displayValue = timekeeping?.totalWorkHour ?? "N";
      } else if (timekeeping) {
        timekeepingId = timekeeping.timekeepingId;
        if (timekeeping.status === LegacyTimekeepingStatus.PENDING) {
          backgroundColor = "#E6F0FF";
          totalWorkHourColor = "#1976D2";
          displayValue = "0";
        }
      } else if (isFutureDate) {
        displayValue = "0";
      }

      if (
        isFutureDate &&
        timekeeping?.status !== LegacyTimekeepingStatus.PENDING &&
        !isNotCurrentMonth
      ) {
        backgroundColor = "#FFFFFF";
        totalWorkHourColor = "#8C8F92";
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.END) {
        backgroundColor = "#C5F0DD";
        totalWorkHourColor = "#00A854";
        displayValue = timekeeping.totalWorkHour;
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.NOT_WORK) {
        displayValue = "N";
      }
      return {
        date: date,
        dateString: dateString,
        day: date.date(),
        month: date.month() + 1,
        year: date.year(),
        timekeepingId: timekeepingId,
        backgroundColor: backgroundColor,
        totalWorkHourColor: totalWorkHourColor,
        displayValue: displayValue,
        hasOT: timekeeping?.hasOT ?? false,
        isNotCurrentMonth: isNotCurrentMonth,
        isFutureDate: isFutureDate,
      };
    });
  }, [calendarDays, currentMonth]);

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  return (
    <View style={styles.calendarContainer}>
      {/* ==== HEADER ==== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
          <ChevronLeft color="#000" size={26} />
        </TouchableOpacity>

        <View>
          <Text style={styles.monthText}>
            Tháng {currentMonth.month() + 1} / {currentMonth.year()}
          </Text>
        </View>

        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <ChevronRight color="#000" size={26} />
        </TouchableOpacity>
      </View>

      {/* ==== WEEK HEADER ==== */}
      <View style={styles.weekHeader}>
        {["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"].map((day) => (
          <View key={day} style={styles.weekDayWrapper}>
            <Text
              style={[
                styles.weekDay,
                (day === "CN" || day === "T.7") && { color: "#D32F2F" },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* ==== CALENDAR GRID ==== */}
      <View style={styles.daysGrid}>
        {calendarData.map((dayData, index) => (
          <View key={index} style={styles.dayCell}>
            {dayData ? (
              <TimekeepingBox
                dayData={dayData}
                onPress={(timekeepingId) => {
                  if (timekeepingId === 0) {
                    return;
                  }
                  setSelectedTimekeepingId(timekeepingId);
                }}
              />
            ) : (
              <View style={styles.emptyCell} />
            )}
          </View>
        ))}
      </View>
      <TimekeepingModal
        visible={selectedTimekeepingId !== 0}
        onClose={() => setSelectedTimekeepingId(0)}
        selectedTimekeepingId={selectedTimekeepingId}
      />
      {/* ==== LEGEND ==== */}
      <TimesheetNotes />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    margin: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    marginBottom: 2,
  },
  weekDayWrapper: {
    backgroundColor: "#F8F8F8",
    width: "14.28%",
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    paddingVertical: 12,
  },
  weekDay: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dayCell: {
    width: "14.28%",
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCell: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    backgroundColor: "#F8F8F8",
    borderColor: "#E0E0E0",
    borderTopWidth: 0,
  },
});
