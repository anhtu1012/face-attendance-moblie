import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const NoContractFound = ({ text }: { text: string }) => {
  if (!text) {
    text = "Không có phụ lục hợp đồng";
  }
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/contract.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
};

export default NoContractFound;

const styles = StyleSheet.create({
  emptyImage: {
    width: "60%",
    height: "60%",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 16,
  },
});
