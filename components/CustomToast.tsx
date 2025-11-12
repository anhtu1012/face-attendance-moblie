import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const toastConfig = {
  // Customize success toast
  success: (props: any) => (
    <View style={[styles.container, styles.successContainer]}>
      <View style={styles.iconContainer}>
        <Feather name="check-circle" size={24} color="#10B981" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
      </View>
    </View>
  ),

  // Customize error toast
  error: (props: any) => (
    <View style={[styles.container, styles.errorContainer]}>
      <View style={styles.iconContainer}>
        <Feather name="x-circle" size={24} color="#EF4444" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
      </View>
    </View>
  ),

  // Customize info toast
  info: (props: any) => (
    <View style={[styles.container, styles.infoContainer]}>
      <View style={styles.iconContainer}>
        <Feather name="info" size={24} color="#3B82F6" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
      </View>
    </View>
  ),

  // Customize warning toast
  warning: (props: any) => (
    <View style={[styles.container, styles.warningContainer]}>
      <View style={styles.iconContainer}>
        <Feather name="alert-triangle" size={24} color="#F59E0B" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successContainer: {
    backgroundColor: "#ECFDF5",
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  infoContainer: {
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  warningContainer: {
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
});
