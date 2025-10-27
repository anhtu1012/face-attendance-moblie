import { Timekeeping } from "@/models/timesheet/timekeeping";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
const TimekeepingBox = ({
  date,
  calendarMonth,
  onPress,
  fakeTimekeepings,
}: {
  date: {
    dateString: string;
    day: number;
    month: number;
    year: number;
  };
  calendarMonth: number;
  onPress: (timekeepingId: number) => void;
  fakeTimekeepings: Timekeeping[];
}) => {
  const timekeeping = fakeTimekeepings.find(
    (timekeeping) => timekeeping.date === date?.dateString
  );

  const renderDayNumber = (day: number, month: number) => {
    if (day < 10 && day > 1) {
      return `0${day}`;
    }
    if (day == 1) {
      return `01/${month}`;
    }
    return `${day}`;
  };

  // Tính toán trực tiếp thay vì dùng state
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isNotCurrentMonth = date?.month !== calendarMonth;
  const currentDateObj = date?.dateString ? new Date(date.dateString) : null;
  const isFutureDate = !!(currentDateObj && currentDateObj > today);

  // Tính backgroundColor và color trực tiếp
  let backgroundColor = "#FFFFFF";
  let totalWorkHourColor = "#8C8F92";

  if (isNotCurrentMonth) {
    backgroundColor = "#F8F8F8";
  } else if (timekeeping?.status === "END") {
    backgroundColor = "#C5F0DD";
    totalWorkHourColor = "#00A854";
  } else if (timekeeping?.status === "PENDING") {
    backgroundColor = "#E6F0FF";
    totalWorkHourColor = "#1976D2";
  }

  if (isFutureDate && timekeeping?.status !== "PENDING" && !isNotCurrentMonth) {
    backgroundColor = "#FFFFFF";
    totalWorkHourColor = "#8C8F92";
  }

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 75,
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderTopWidth: 0,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      onPress={() => onPress(timekeeping?.timekeepingId ?? 0)}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: "#000",
          marginBottom: 7,
          marginTop: 6,
        }}
      >
        {renderDayNumber(date?.day ?? 0, date?.month ?? 0)}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: totalWorkHourColor,
        }}
      >
        {isFutureDate
          ? "0"
          : timekeeping?.status === "PENDING"
          ? "0"
          : timekeeping?.totalWorkHour
          ? timekeeping?.totalWorkHour
          : "N"}
      </Text>

      {!isFutureDate && timekeeping?.hasOT && (
        <Text
          style={{
            color: "#FBC02D",
            fontSize: 10,
            marginTop: 2,
          }}
        >
          ★
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TimekeepingBox;
