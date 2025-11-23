import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const NotWorkNotification = () => {
  return (
    <View style={styles.notWorkContainer}>
      <Image
        source={require("../../assets/images/not-work.jpg")}
        style={styles.notWorkImage}
      />
      <Text style={styles.notWorkDescription}>
        Bạn không có lịch chấm công vào ngày này
      </Text>
      <Text style={styles.notWorkSubText}>
        Không có dữ liệu chấm công để hiển thị
      </Text>
    </View>
  );
};

export default NotWorkNotification;

const styles = StyleSheet.create({
  notWorkContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  notWorkImage: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  notWorkDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 4,
  },
  notWorkSubText: {
    fontSize: 13,
    color: "#95A5A6",
    textAlign: "center",
  },
});
