// components/ui/DatePickerInput.tsx
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DatePickerInputProps {
  label?: string;
  value?: Date | string;
  error?: string;
  onChange: (date: Date) => void;
  onFocus?: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
  isEditing?: boolean;
  icon?: string;
  iconColor?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  error,
  onChange,
  onFocus,
  maximumDate,
  minimumDate,
  placeholder,
  disabled = false,
  style,
  isEditing = false,
  icon = "calendar",
  iconColor = "#D69E2E",
}) => {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return placeholder || `Chọn ${label?.toLowerCase() || "ngày"}`;

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("vi-VN");
    } catch (error) {
      return placeholder || `Chọn ${label?.toLowerCase() || "ngày"}`;
    }
  };

  const handlePress = () => {
    if (disabled) return;
    setShow(true);
    onFocus && onFocus();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {isEditing ? (
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.infoItem,
            error && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
          activeOpacity={0.8}
          disabled={disabled}
        >
          <View style={styles.infoIconContainer}>
            <MaterialIcons name={icon as any} size={20} color={iconColor} />
          </View>
          <View style={styles.infoTextContainer}>
            {label && <Text style={styles.infoLabel}>{label}</Text>}
            <Text
              style={[
                styles.infoValue,
                !value && styles.placeholderText,
                disabled && styles.disabledText,
              ]}
            >
              {formatDate(value)}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name={icon as any} size={20} color={iconColor} />
          </View>
          <View style={styles.infoTextContainer}>
            {label && <Text style={styles.infoLabel}>{label}</Text>}
            <Text style={styles.infoValue}>{formatDate(value)}</Text>
          </View>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={
            value
              ? typeof value === "string"
                ? new Date(value)
                : value
              : new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
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
  inputError: {
    borderBottomColor: "#FF4D4F",
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  disabledText: {
    color: "#6B7280",
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
