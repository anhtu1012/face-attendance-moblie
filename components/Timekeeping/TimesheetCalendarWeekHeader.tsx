import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TimesheetCalendarWeekHeader = ({ weekDays }: { weekDays: string[] }) => {
  return (
    <View style={styles.weekHeader}>
      {weekDays.map((day) => (
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
  );
};

export default TimesheetCalendarWeekHeader;

const styles = StyleSheet.create({
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
});
