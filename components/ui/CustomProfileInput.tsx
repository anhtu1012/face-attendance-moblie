import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const CustomProfileInput = ({
  error,
  icon,
  label,
  iconColor,
  isEditing,
  keyboardType = "default",
  ...props
}: any) => (
  <View style={[styles.infoItem]}>
    <View style={styles.infoIconContainer}>
      <Feather name={icon} size={20} color={iconColor} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <>
          <TextInput
            style={[
              styles.infoValue,
              {
                borderBottomWidth: 1,
                borderBottomColor: error ? "#FF4D4F" : "black",
              },
            ]}
            {...props}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
      ) : (
        <Text style={[styles.infoValue, error && { color: "#FF4D4F" }]}>
          {props.value || "Chưa cập nhật"}
        </Text>
      )}
    </View>
  </View>
);

export default CustomProfileInput;

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
