import { useGetTimekeepingData } from "@/hooks/useGetTimekeepingData";
import { RootState } from "@/lib/store";
import { LegacyTimekeepingStatus } from "@/models/timesheet/timekeeping";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import TimekeepingBox from "./TimekeepingBox";
import TimekeepingModal from "./TimekeepingModal";
import TimesheetCalendarHeader from "./TimesheetCalendarHeader";
import TimesheetCalendarWeekHeader from "./TimesheetCalendarWeekHeader";
import TimesheetNotes from "./TimesheetNotes";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("vi");

export default function TimesheetCalendar() {
  const userId = useSelector((state: RootState) => state.auth.userProfile.id);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const {
    timekeepingData: timekeepingDataList,
    isLoading: isLoadingTimekeeping,
  } = useGetTimekeepingData({
    userId: userId!,
    startTime: currentMonth.startOf("month").toISOString(),
    endTime: currentMonth.endOf("month").toISOString(),
  });
  const [selectedTimekeepingId, setSelectedTimekeepingId] = useState<number>(0);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = endOfMonth.date();
    const firstDayIndex = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const daysArray: (dayjs.Dayjs | null)[] = [];

    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = startOfMonth.date(day);
      daysArray.push(date);
    }

    while (daysArray.length % 7 !== 0) daysArray.push(null);

    return daysArray;
  }, [currentMonth]);

  const calendarData = useMemo(() => {
    return calendarDays.map((date) => {
      if (!date) return null;

      const dateString = date.format("YYYY-MM-DD");
      const timekeeping = timekeepingDataList?.data.find(
        (t: any) => t.date === dateString
      );
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
        timekeepingId = parseInt(timekeeping.timekeepingId);
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
    <View>
      <TimesheetCalendarHeader
        currentMonth={currentMonth}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />
      <TimesheetCalendarWeekHeader
        weekDays={["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"]}
      />
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
      <TimesheetNotes />
    </View>
  );
}

const styles = StyleSheet.create({
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
