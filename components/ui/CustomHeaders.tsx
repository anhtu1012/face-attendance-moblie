import { AntDesign } from "@expo/vector-icons";

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomHeaders = ({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack}>
          <AntDesign
            name="arrow-left"
            size={24}
            color="#919296"
            style={styles.goBackArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

export default CustomHeaders;
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  goBackArrow: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
