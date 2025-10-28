import { X } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface Props {
  dateString: string;
  onClose: () => void;
}
const TimesheetModalHeader = ({ dateString, onClose }: Props) => {
  return (
    <View style={styles.header}>
      <View style={{ width: 10, height: 10 }} />
      <Text style={styles.headerTitle}>Chấm công ngày {dateString}</Text>
      <TouchableOpacity onPress={onClose}>
        <X size={22} color="#444" />
      </TouchableOpacity>
    </View>
  );
};

export default TimesheetModalHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    paddingVertical: 2,
  },
});
