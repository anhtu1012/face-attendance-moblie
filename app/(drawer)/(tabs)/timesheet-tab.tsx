import React from "react";
import { StyleSheet, Text, View } from "react-native";

// This is a placeholder component since the actual timesheet navigation
// is handled by the /timesheet route
export default function TimesheetTabPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Timesheet Tab Placeholder</Text>
      <Text style={styles.subText}>
        This tab redirects to the main timesheet screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
