import React from "react";
import { Text, View } from "react-native";

const TimesheetNotes = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ color: "#FBC02D", fontSize: 12, fontWeight: "bold" }}>
          ★
        </Text>
        <Text style={{ color: "#666", fontSize: 13 }}>Có OT</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            backgroundColor: "#E3F2FD",
            width: 20,
            height: 20,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#1976D2",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            8
          </Text>
        </View>
        <Text style={{ color: "#666", fontSize: 13 }}>Giờ làm</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            backgroundColor: "#FDF9E8",
            width: 20,
            height: 20,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFC107",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            0
          </Text>
        </View>
        <Text style={{ color: "#666", fontSize: 13 }}>Đang làm</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 10,
            height: 20,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#8C8F92",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            N
          </Text>
        </View>
        <Text style={{ color: "#666", fontSize: 13 }}>Nghỉ làm</Text>
      </View>
    </View>
  );
};

export default TimesheetNotes;
