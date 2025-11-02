import { CheckinStatus, CheckoutStatus } from "@/models/timesheet/timekeeping";
import { CheckCircle, Clock, XCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Types
type StatusValue = CheckinStatus | CheckoutStatus;

interface TimeDetailItem {
  label: string;
  value: string | number | StatusValue;
}

interface TimeDetailBoxProps {
  title?: string;
  data: TimeDetailItem[];
}

const STATUS_CONFIG = {
  [CheckinStatus.START_LATE]: {
    color: "#E74C3C",
    icon: Clock,
    label: "Đi muộn",
  },
  [CheckoutStatus.END_EARLY]: {
    color: "#E74C3C",
    icon: XCircle,
    label: "Về sớm",
  },
  [CheckinStatus.START_ONTIME]: {
    color: "#2ECC71",
    icon: CheckCircle,
    label: "Đúng giờ",
  },
  [CheckoutStatus.END_ONTIME]: {
    color: "#2ECC71",
    icon: CheckCircle,
    label: "Đúng giờ",
  },
} as const;

const isStatusValue = (
  value: string | number | StatusValue
): value is StatusValue => {
  return typeof value === "string" && value in STATUS_CONFIG;
};

const getStatusIcon = (status: StatusValue) => {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;
  return <IconComponent color={config.color} size={18} />;
};

const getValueColor = (value: string | number): string => {
  if (isStatusValue(value)) {
    return STATUS_CONFIG[value].color;
  }
  return "#000";
};

const renderValue = (value: string | number) => {
  if (isStatusValue(value)) {
    return getStatusIcon(value);
  }
  return value;
};

// Component
export default function TimeDetailBox({ title, data }: TimeDetailBoxProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.card}>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={[styles.value, { color: getValueColor(item.value) }]}>
              {renderValue(item.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontWeight: "400",
    fontSize: 14,
    color: "#828282",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});
