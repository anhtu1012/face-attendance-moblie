import { Timekeeping } from "@/models/timesheet/timekeeping";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
const TimekeepingBox = ({
  date,
  calendarMonth,
}: {
  date: {
    dateString: string;
    day: number;
    month: number;
    year: number;
  };
  calendarMonth: number;
}) => {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [totalWorkHourColor, setTotalWorkHourColor] = useState("#000");
  const [isFutureDate, setIsFutureDate] = useState(false);
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
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isNotCurrentMonth = date?.month !== calendarMonth;
    const currentDateObj = date?.dateString ? new Date(date.dateString) : null;
    setIsFutureDate(!!(currentDateObj && currentDateObj > today));
    if (!timekeeping) {
      setBackgroundColor("#FFFFFF");
      setTotalWorkHourColor("#8C8F92");
    }
    if (timekeeping?.status === "END") {
      setBackgroundColor("#E3F2FD");
      setTotalWorkHourColor("#1976D2");
    }
    if (timekeeping?.status === "PENDING") {
      setBackgroundColor("#FDF9E8");
      setTotalWorkHourColor("#F57C00");
    }
    if (isFutureDate && timekeeping?.status !== "PENDING") {
      setBackgroundColor("#FFFFFF");
      setTotalWorkHourColor("#8C8F92");
    }
    if (isNotCurrentMonth) {
      setBackgroundColor("#F8F8F8");
    }
  }, [calendarMonth, date]);

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
      onPress={() => {
        console.log("date", date);
        console.log(`Is future date: ${isFutureDate}`);
      }}
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
const fakeTimekeepings: Timekeeping[] = [
  {
    date: "2025-10-26",
    totalWorkHour: 0,
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "PENDING",
  },
  {
    date: "2025-10-25",
    totalWorkHour: 8,
    checkinTime: "08:00",
    checkoutTime: "12:00",
    hasOT: false,
    status: "END",
  },
  {
    date: "2025-10-24",
    totalWorkHour: 10.0,
    checkinTime: "07:30",
    checkoutTime: "18:00",
    hasOT: true,
    status: "END",
  },
  {
    date: "2025-10-23",
    totalWorkHour: 8,
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "END",
  },
  {
    date: "2025-10-22",
    totalWorkHour: 8,
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "END",
  },
  {
    date: "2025-10-21",
    totalWorkHour: 8,
    checkinTime: "09:15",
    checkoutTime: "17:00",
    hasOT: false,
    status: "END",
  },
  {
    date: "2025-10-20",
    totalWorkHour: 8.5,
    checkinTime: "08:30",
    checkoutTime: "17:30",
    hasOT: true,
    status: "END",
  },
  {
    date: "2025-10-19",
    totalWorkHour: 8,
    checkinTime: "",
    checkoutTime: "",
    hasOT: false,
    status: "END",
  },
];
