import { CheckinStatus, CheckoutStatus } from "@/models/timesheet/timekeeping";
import { CheckCircle, CircleAlert, XCircle } from "lucide-react-native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CheckTimeBoxProps {
  type: "out" | "in";
  time: string;
  checkinStatus?: CheckinStatus | string;
  checkoutStatus?: CheckoutStatus | string;
}

const CheckTimeBox = ({
  type,
  time,
  checkinStatus,
  checkoutStatus,
}: CheckTimeBoxProps) => {
  const isCheckinOntime = checkinStatus === CheckinStatus.START_ONTIME;
  const isCheckoutOntime = checkoutStatus === CheckoutStatus.END_ONTIME;
  const handleRenderCardBackground = (
    type: CheckTimeBoxProps["type"],
  ): StyleProp<ViewStyle> => {
    if (type === "in") {
      if (!checkinStatus) return { backgroundColor: "#FFF4E0" };
      if (isCheckinOntime) return { backgroundColor: "#E9F7EF" };
      return { backgroundColor: "#FFE8E8" };
    }
    if (!checkoutStatus) return { backgroundColor: "#FFF4E0" };
    if (isCheckoutOntime) return { backgroundColor: "#E9F7EF" };
    return { backgroundColor: "#FFE8E8" };
  };

  const handleRenderCardColor = (
    type: CheckTimeBoxProps["type"],
  ): StyleProp<TextStyle> => {
    if (type === "in") {
      if (!checkinStatus) return { color: "#F59E0B" };
      if (isCheckinOntime) return { color: "#2ECC71" };
      return { color: "#E74C3C" };
    }
    if (!checkoutStatus) return { color: "#F59E0B" };
    if (isCheckoutOntime) return { color: "#2ECC71" };
    return { color: "#E74C3C" };
  };

  const handleRenderCardIcon = (type: CheckTimeBoxProps["type"]) => {
    if (type === "in") {
      if (!checkinStatus) return <CircleAlert color="#F59E0B" size={18} />;
      if (isCheckinOntime) return <CheckCircle color="#2ECC71" size={18} />;
      return <XCircle color="#E74C3C" size={18} />;
    }
    if (!checkoutStatus) return <CircleAlert color="#F59E0B" size={18} />;
    if (isCheckoutOntime) return <CheckCircle color="#2ECC71" size={18} />;
    return <XCircle color="#E74C3C" size={18} />;
  };

  const handleRenderContent = (type: CheckTimeBoxProps["type"]) => {
    if (type === "in") {
      if (!checkinStatus) return "Chưa check-in";
      if (isCheckinOntime) return "Đến đúng giờ";
      return "Đến trễ";
    }
    if (!checkoutStatus) return "Chưa check-out";
    if (isCheckoutOntime) return "Về đúng giờ";
    return "Về sớm";
  };

  return (
    <View style={[styles.card, handleRenderCardBackground(type)]}>
      <Text style={styles.cardLabel}>
        {type === "in" ? "Giờ vào" : "Giờ ra"}
      </Text>
      <View style={styles.cardRow}>
        <Text style={[styles.cardValue, handleRenderCardColor(type)]}>
          {time ? time : "--:--"}
        </Text>
        {handleRenderCardIcon(type)}
      </View>
      <Text style={[styles.cardNote]}>{handleRenderContent(type)}</Text>
    </View>
  );
};

export default CheckTimeBox;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
  },
  cardLabel: {
    fontSize: 13,
    color: "#000",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  cardValue: {
    fontSize: 23,
    fontWeight: "700",
    color: "#2C3E50",
  },
  cardNote: {
    fontSize: 12,
    color: "#7A7A7A",
  },
});
