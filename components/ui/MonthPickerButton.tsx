import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const MonthPickerButton = ({
  setShowMonthPicker,
}: {
  setShowMonthPicker: (show: boolean) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.monthSelector}
      onPress={() => setShowMonthPicker(true)}
      activeOpacity={0.7}
    >
      <Feather name="calendar" size={18} color="#3674B5" />
      <Feather name="chevron-down" size={18} color="#3674B5" />
    </TouchableOpacity>
  );
};

export default MonthPickerButton;

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#3674B5",
    width: "20%",
  },
});
