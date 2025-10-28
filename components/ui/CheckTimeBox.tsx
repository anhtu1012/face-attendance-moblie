import { CheckinStatus, CheckoutStatus } from "@/models/timesheet/timekeeping";
import { CheckCircle, XCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CheckTimeBoxProps {
  type: "out" | "in";
  time: string;
  checkinStatus: CheckinStatus;
  checkoutStatus: CheckoutStatus;
}

const CheckTimeBox = ({
  type,
  time,
  checkinStatus,
  checkoutStatus,
}: CheckTimeBoxProps) => {
  const isCheckinOntime = checkinStatus === CheckinStatus.START_ONTIME;
  const isCheckoutOntime = checkoutStatus === CheckoutStatus.END_ONTIME;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            type === "in"
              ? isCheckinOntime
                ? "#E9F7EF"
                : "#FFE8E8"
              : isCheckoutOntime
              ? "#E8F6F3"
              : "#FFE8E8",
        },
      ]}
    >
      <Text style={styles.cardLabel}>
        {type === "in" ? "Giờ vào" : "Giờ ra"}
      </Text>
      <View style={styles.cardRow}>
        <Text
          style={[
            styles.cardValue,
            {
              color:
                type === "in"
                  ? isCheckinOntime
                    ? "#2ECC71"
                    : "#E74C3C"
                  : isCheckoutOntime
                  ? "#2ECC71"
                  : "#E74C3C",
            },
          ]}
        >
          {time}
        </Text>
        {type === "in" ? (
          isCheckinOntime ? (
            <CheckCircle color="#2ECC71" size={18} />
          ) : (
            <XCircle color="#E74C3C" size={18} />
          )
        ) : isCheckoutOntime ? (
          <CheckCircle color="#2ECC71" size={18} />
        ) : (
          <XCircle color="#E74C3C" size={18} />
        )}
      </View>
      <Text style={[styles.cardNote]}>
        {type === "in"
          ? isCheckinOntime
            ? "Đến đúng giờ"
            : "Đi muộn"
          : isCheckoutOntime
          ? "Về đúng giờ"
          : "Về sớm"}
      </Text>
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
