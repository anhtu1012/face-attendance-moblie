import { Timekeeping } from "@/models/timesheet/timekeeping";
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

  const [showModal, setShowModal] = useState(false);
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = endOfMonth.date();
    const firstDayIndex = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const daysArray = [];

    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = startOfMonth.date(day);
      daysArray.push(date);
    }
    while (daysArray.length % 7 !== 0) daysArray.push(null);
    return daysArray;
  }, [currentMonth]);

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  return (
    <View style={styles.calendarContainer}>
      {/* ==== HEADER ==== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
          <ChevronLeft color="#3674B5" size={26} />
        </TouchableOpacity>

        <View>
          <Text style={styles.monthText}>
            Tháng {currentMonth.month() + 1} / {currentMonth.year()}
          </Text>
        </View>

        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <ChevronRight color="#3674B5" size={26} />
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
        {calendarDays.map((date, index) => (
          <View key={index} style={styles.dayCell}>
            {date ? (
              <TimekeepingBox
                fakeTimekeepings={fakeTimekeepings}
                date={{
                  dateString: date.format("YYYY-MM-DD"),
                  day: date.date(),
                  month: date.month() + 1,
                  year: date.year(),
                }}
                calendarMonth={currentMonth.month() + 1}
                onPress={(timekeepingId) => {
                  if (timekeepingId === 0) {
                    return;
                  }
                  setSelectedTimekeepingId(timekeepingId);
                  setShowModal(true);
                }}
              />
            ) : (
              <View style={styles.emptyCell} />
            )}
          </View>
        ))}
      </View>
      <TimekeepingModal
        visible={showModal}
        onClose={() => setShowModal(false)}
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
    backgroundColor: "#F7FAFC",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3674B5",
    textAlign: "center",
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
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
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "END",
  },
  {
    timekeepingId: 5,
    date: "2025-10-22",
    totalWorkHour: 8,
    checkinTime: "",
    checkoutTime: "",
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
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "END",
  },
];
