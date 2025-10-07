import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
  disabled?: boolean;
  labelStyle?: any;
  containerStyle?: any;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  selectedValue,
  onPress,
  disabled = false,
  labelStyle,
  containerStyle,
}) => {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => !disabled && onPress(value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radioCircle,
          isSelected && styles.radioCircleSelected,
          disabled && styles.radioCircleDisabled,
        ]}
      >
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <Text
        style={[
          styles.label,
          isSelected && styles.labelSelected,
          disabled && styles.labelDisabled,
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface RadioGroupProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  direction?: "row" | "column";
  disabled?: boolean;
  containerStyle?: any;
  itemStyle?: any;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
  direction = "row",
  disabled = false,
  containerStyle,
  itemStyle,
}) => {
  return (
    <View
      style={[
        styles.groupContainer,
        direction === "column" && styles.groupColumn,
        containerStyle,
      ]}
    >
      {options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          value={option.value}
          selectedValue={selectedValue}
          onPress={onValueChange}
          disabled={disabled}
          containerStyle={itemStyle}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  radioCircleSelected: {
    borderColor: "#3674B5",
    backgroundColor: "#f8f9fa",
  },
  radioCircleDisabled: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3674B5",
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  labelSelected: {
    color: "#3674B5",
    fontWeight: "600",
  },
  labelDisabled: {
    color: "#999",
  },
  groupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  groupColumn: {
    flexDirection: "column",
  },
});

export default RadioButton;
