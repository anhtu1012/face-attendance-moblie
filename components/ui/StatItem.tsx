import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// StatItem Component
interface StatItemProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  highlight?: boolean;
  suffix?: string;
  moneyValue?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  color,
  highlight = false,
  suffix = "",
  moneyValue = "",
}) => (
  <View style={styles.statItem}>
    <View style={styles.statLeft}>
      <View style={[styles.statIconBox, { backgroundColor: `${color}15` }]}>
        <Feather name={icon as any} size={16} color={color} />
      </View>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
    <Text
      style={[
        styles.statValue,
        highlight && value > 0 && { color: "#EF4444", fontWeight: "700" },
      ]}
    >
      {moneyValue ? `${moneyValue} đ` : value}
      {suffix}
    </Text>
  </View>
);

export default StatItem;

const styles = StyleSheet.create({
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    minWidth: 40,
    textAlign: "right",
  },
});
