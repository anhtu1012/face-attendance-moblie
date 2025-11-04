import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
      <LinearGradient
        colors={["#3674B5", "#2196F3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContent}
      >
        <TouchableOpacity onPress={onBack}>
          <AntDesign
            name="arrow-left"
            size={24}
            color="#ffffff"
            style={styles.goBackArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

export default CustomHeaders;
const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  goBackArrow: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
});
