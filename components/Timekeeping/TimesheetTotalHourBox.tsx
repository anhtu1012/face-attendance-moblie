import { Hourglass } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  totalWorkHour: number;
  totalTimekeepingNumber: number;
}
const TimesheetTotalHourBox = ({
  totalWorkHour,
  totalTimekeepingNumber,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Tổng giờ</Text>
        <Hourglass color="#7C3AED" size={18} />
      </View>

      <View style={styles.content}>
        <Text style={styles.value}>
          {totalWorkHour?.toFixed(1) ?? "0"}
          <Text style={styles.unit}> h</Text>
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.badge}>
           <Text style={styles.badgeText}>{totalTimekeepingNumber ?? 0} công</Text>
        </View>
      </View>
    </View>
  );
};

export default TimesheetTotalHourBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    minHeight: 110,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
    textTransform: "uppercase",
  },
  content: {
    justifyContent: "center",
    marginVertical: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    color: "#7C3AED",
    letterSpacing: 0.5,
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  footer: {
    alignItems: "flex-start",
  },
  badge: {
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7C3AED",
  }
});
