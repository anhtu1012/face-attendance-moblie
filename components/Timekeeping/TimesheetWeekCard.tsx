import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TimesheetWeekCard = ({
  item,
  setSelectedTimekeepingId,
}: {
  item: any;
  setSelectedTimekeepingId: (timekeepingId: number) => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.dayCard, item.isPending && styles.activeCard]}
      onPress={() => {
        if (item.timekeepingId !== 0) {
          setSelectedTimekeepingId(item.timekeepingId);
        }
      }}
    >
      {/* Left: Day & Date */}
      <View style={styles.leftSection}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Right: Status & Details */}
      <View style={styles.rightSection}>
        <Text style={[styles.statusText, { color: item.statusColor }]}>
          {item.status}
        </Text>

        {item.timeRange ? (
          <View style={styles.detailsRow}>
            <Text style={styles.timeText}>{item.timeRange}</Text>
            {item.hasOT ? (
              <View style={styles.otBadge}>
                <Text style={styles.otText}>★</Text>
              </View>
            ) : (
              <View style={[styles.otBadge, { backgroundColor: "#fff" }]}>
                <Text style={[styles.otText, { fontSize: 0 }]}></Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.detailsRow}>
            <Text style={styles.timeText}>_ _ : _ _ - _ _ : _ _</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TimesheetWeekCard;

const styles = StyleSheet.create({
  dayCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activeCard: {
    backgroundColor: "#E3F2FD",
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "space-around",
    minWidth: 60,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    color: "#7A7A7A",
  },
  divider: {
    width: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 15,
    color: "#7A7A7A",
    marginRight: 8,
  },
  otBadge: {
    backgroundColor: "#FBC02D",
    borderRadius: 25,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  otText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
