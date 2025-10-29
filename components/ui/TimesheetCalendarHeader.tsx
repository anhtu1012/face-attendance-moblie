import { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const TimesheetCalendarHeader = ({
  currentMonth,
  handlePrevMonth,
  handleNextMonth,
}: {
  currentMonth: Dayjs;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}) => {
  return (
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
  );
};

export default TimesheetCalendarHeader;

const styles = StyleSheet.create({
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
});
