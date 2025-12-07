import { useGetTimekeepingData } from "@/hooks/useGetTimekeepingData";
import { RootState } from "@/lib/store";
import { LegacyTimekeepingStatus } from "@/models/timesheet/timekeeping";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
  const [visibleModal, setVisibleModal] = useState(false);
  const [offDateString, setOffDateString] = useState<string>("");
  const {
    timekeepingData: timekeepingDataList,
    isLoading: isLoadingTimekeeping,
    refetch,
    isFetching,
  } = useGetTimekeepingData({
    userId: userId!,
    startTime: currentMonth.startOf("month").toISOString(),
    endTime: currentMonth.endOf("month").toISOString(),
  });

  const [selectedTimekeepingId, setSelectedTimekeepingId] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetch();
      }
    }, [userId, refetch])
  );

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
  }, [currentMonth, timekeepingDataList]);

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
      if (timekeeping?.status === LegacyTimekeepingStatus.END_ONTIME) {
        backgroundColor = "#C5F0DD";
        totalWorkHourColor = "#00A854";
        displayValue = timekeeping?.totalWorkHour ?? "0";
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.NOT_WORK) {
        backgroundColor = "#FFE5E5";
        totalWorkHourColor = "#E74C3C";
        displayValue = timekeeping?.totalWorkHour ?? "0";
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.END_LATE) {
        backgroundColor = "#C5F0DD";
        totalWorkHourColor = "#E74C3C";
        displayValue = timekeeping?.totalWorkHour ?? "0";
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.END_EARLY) {
        backgroundColor = "#C5F0DD";
        totalWorkHourColor = "#E74C3C";
        displayValue = timekeeping?.totalWorkHour ?? "0";
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.START_ONTIME) {
        backgroundColor = "#C5F0DD";
        totalWorkHourColor = "#E74C3C";
        displayValue = timekeeping?.totalWorkHour ?? "0";
      }
      if (timekeeping?.status === LegacyTimekeepingStatus.FORGET_LOG) {
        backgroundColor = "#C5F0DD";
        totalWorkHourColor = "#00A854";
        displayValue = timekeeping?.totalWorkHour ?? "0";
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
  }, [calendarDays, currentMonth, timekeepingDataList]);

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return isLoadingTimekeeping ? (
    <View>
      <ActivityIndicator size="small" color="#3674B5" />
    </View>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3674B5"]}
          tintColor="#3674B5"
        />
      }
      showsVerticalScrollIndicator={false}
    >
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
                  setSelectedTimekeepingId(timekeepingId);
                  const dateString = new Date(
                    dayData?.dateString ?? ""
                  ).toLocaleDateString("vi-VN");
                  setOffDateString(dateString);
                  setVisibleModal(true);
                }}
              />
            ) : (
              <View style={styles.emptyCell} />
            )}
          </View>
        ))}
      </View>
      <TimekeepingModal
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
        selectedTimekeepingId={selectedTimekeepingId}
        offDateString={offDateString}
      />
      <TimesheetNotes />
    </ScrollView>
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
