import { DatePickerInput } from "@/components/ui/DatePickerInput";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Ví dụ sử dụng DatePickerInput với style giống CustomProfileInput
export const DatePickerInputExample = () => {
  const [birthday, setBirthday] = React.useState<Date | undefined>();
  const [issueDate, setIssueDate] = React.useState<Date | undefined>();
  const [startDate, setStartDate] = React.useState<Date | undefined>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DatePickerInput Examples</Text>

      {/* Ví dụ 1: Ngày sinh */}
      <DatePickerInput
        label="Ngày sinh"
        value={birthday}
        onChange={setBirthday}
        icon="cake"
        iconColor="#D69E2E"
        isEditing={true}
        maximumDate={new Date()}
        placeholder="Chọn ngày sinh"
      />

      {/* Ví dụ 2: Ngày cấp */}
      <DatePickerInput
        label="Ngày cấp"
        value={issueDate}
        onChange={setIssueDate}
        icon="card-membership"
        iconColor="#38A169"
        isEditing={true}
        maximumDate={new Date()}
        placeholder="Chọn ngày cấp"
      />

      {/* Ví dụ 3: Ngày bắt đầu */}
      <DatePickerInput
        label="Ngày bắt đầu"
        value={startDate}
        onChange={setStartDate}
        icon="event"
        iconColor="#3182CE"
        isEditing={true}
        maximumDate={new Date()}
        placeholder="Chọn ngày bắt đầu"
      />

      {/* Ví dụ 4: Read-only mode */}
      <DatePickerInput
        label="Ngày tạo"
        value={new Date()}
        onChange={() => {}}
        icon="schedule"
        iconColor="#805AD5"
        isEditing={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
});
