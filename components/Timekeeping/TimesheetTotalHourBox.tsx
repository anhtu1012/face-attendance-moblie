import { Clock } from "lucide-react-native";
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
    <View style={[styles.cardFull, { backgroundColor: "#F5EEFF" }]}>
      <View style={styles.cardRow}>
        <Clock color="#7E57C2" size={18} />
        <Text style={styles.totalHourText}>
          {totalWorkHour?.toFixed(1) ?? "0"} giờ
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#7E57C2",
          height: 5,
          borderRadius: 5,
          width: "100%",
          marginTop: 6,
          marginBottom: 6,
        }}
      />
      <Text style={styles.totalHourValue}>{totalTimekeepingNumber ?? 0}</Text>
    </View>
  );
};

export default TimesheetTotalHourBox;

const styles = StyleSheet.create({
  cardFull: {
    borderRadius: 12,
    padding: 14,
  },
  totalHourText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    color: "#7E57C2",
  },
  totalHourValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7E57C2",
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
});
