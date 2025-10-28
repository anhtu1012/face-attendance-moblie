import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface DayData {
  day: number;
  month: number;
  year: number;
  timekeepingId: number;
  backgroundColor: string;
  totalWorkHourColor: string;
  displayValue: string | number;
  hasOT: boolean;
  isNotCurrentMonth: boolean;
  isFutureDate: boolean;
}

const TimekeepingBox = ({
  dayData,
  onPress,
}: {
  dayData: DayData;
  onPress: (timekeepingId: number) => void;
}) => {
  const renderDayNumber = (day: number, month: number) => {
    if (day < 10 && day > 1) {
      return `0${day}`;
    }
    if (day === 1) {
      return `01/${month}`;
    }
    return `${day}`;
  };

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 75,
        backgroundColor: dayData.backgroundColor,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderTopWidth: 0,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      onPress={() => onPress(dayData.timekeepingId)}
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
        {renderDayNumber(dayData.day, dayData.month)}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: dayData.totalWorkHourColor,
        }}
      >
        {dayData.displayValue}
      </Text>

      {dayData.hasOT && (
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
