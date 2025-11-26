import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface DatePickerButtonProps {
  selectedYear: number;
  selectedMonth: number;
  activeTab: number;
  onPress: () => void;
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  selectedYear,
  selectedMonth,
  activeTab,
  onPress,
}) => {
  // Display logic: activeTab === 2 ? "Năm {year}" : "Tháng {month}/{year}"

  return (
    <TouchableOpacity
      style={styles.dateSelector}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Feather name="calendar" size={18} color="#3674B5" />
      <Feather name="chevron-down" size={16} color="#3674B5" />
    </TouchableOpacity>
  );
};

export default DatePickerButton;

const styles = StyleSheet.create({
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3674B5",
  },
});
