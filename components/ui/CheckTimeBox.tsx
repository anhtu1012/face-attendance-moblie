import { CheckCircle, XCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
interface CheckTimeBoxProps {
  type: "out" | "in";
  time: string;
  checkinStatus: "ontime" | "late";
  checkoutStatus: "ontime" | "early";
}
const CheckTimeBox = ({
  type,
  time,
  checkinStatus,
  checkoutStatus,
}: CheckTimeBoxProps) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            type === "in"
              ? checkinStatus === "ontime"
                ? "#E9F7EF"
                : "#FFE8E8"
              : checkoutStatus === "ontime"
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
                  ? checkinStatus === "ontime"
                    ? "#2ECC71"
                    : "#E74C3C"
                  : checkoutStatus === "ontime"
                  ? "#2ECC71"
                  : "#E74C3C",
            },
          ]}
        >
          {time}
        </Text>
        {type === "in" ? (
          checkinStatus === "ontime" ? (
            <CheckCircle color="#2ECC71" size={18} />
          ) : (
            <XCircle color="#E74C3C" size={18} />
          )
        ) : checkoutStatus === "ontime" ? (
          <CheckCircle color="#2ECC71" size={18} />
        ) : (
          <XCircle color="#E74C3C" size={18} />
        )}
      </View>
      <Text style={[styles.cardNote]}>
        {type === "in"
          ? checkinStatus === "ontime"
            ? "Đến đúng giờ"
            : "Đi muộn"
          : checkoutStatus === "ontime"
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
