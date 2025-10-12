import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { submitForm } from "@/services/form/api";
import { HttpStatusCode } from "axios";

type DateType = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};
const initialDateValue: DateType = {
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  startTime: new Date().toISOString().split("T")[1],
  endTime: new Date().toISOString().split("T")[1],
};

type ShowPickerType = {
  startDate: boolean;
  endDate: boolean;
  startTime: boolean;
  endTime: boolean;
};
const initialShowPickerValue: ShowPickerType = {
  startDate: false,
  endDate: false,
  startTime: false,
  endTime: false,
};

export default function CreateFormPage() {
  const { id, title } = useLocalSearchParams();
  const [reason, setReason] = useState("");
  const [date, setDate] = useState<DateType>(initialDateValue);
  const [showPicker, setShowPicker] = useState<ShowPickerType>(
    initialShowPickerValue,
  );

  const handleSubmitForm = async () => {
    const formData = new FormData();
    formData.append("formId", id as string);
    formData.append("submittedById", "1");
    formData.append("reason", reason);
    formData.append(
      "startTime",
      new Date(date.startDate + "T" + date.startTime).toISOString(),
    );
    formData.append(
      "endTime",
      new Date(date.endDate + "T" + date.endTime).toISOString(),
    );

    try {
      const res = await submitForm(formData);
      const data = res.data;
      if (data?.statusCode == HttpStatusCode.BadRequest) {
        console.log("Không thể gửi đơn");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.navigate("/(drawer)/(tabs)/(form)/choose-form")
            }
          >
            <AntDesign
              name="arrow-left"
              size={24}
              color="#919296"
              style={styles.goBackArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Tạo mới {(title as String).toLowerCase()}
          </Text>
        </View>
      </View>

      {/* form detail */}
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.labelBold}>Thời gian</Text>
            <TouchableOpacity>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Từ giờ</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, startTime: true }))
                }
              >
                <Text>
                  {new Date(date.startDate + "T" + date.startTime)
                    .toLocaleTimeString("vi-VN")
                    .slice(0, 5)}
                </Text>
              </TouchableOpacity>
              {showPicker.startTime && (
                <DateTimePicker
                  value={new Date(date.startDate + "T" + date.startTime)}
                  mode="time"
                  onChange={(e, date) => {
                    setShowPicker((prev) => ({ ...prev, startTime: false }));
                    if (date)
                      setDate((prev) => ({
                        ...prev,
                        startTime: date?.toISOString().split("T")[1],
                      }));
                  }}
                />
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Từ ngày</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, startDate: true }))
                }
              >
                <Text>
                  {new Date(
                    date.startDate + "T" + date.startTime,
                  ).toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
              {showPicker.startDate && (
                <DateTimePicker
                  value={new Date(date.startDate + "T" + date.startTime)}
                  mode="date"
                  onChange={(e, date) => {
                    setShowPicker((prev) => ({ ...prev, startDate: false }));
                    if (date)
                      setDate((prev) => ({
                        ...prev,
                        startDate: date?.toISOString().split("T")[0],
                      }));
                  }}
                />
              )}
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Đến giờ</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, endTime: true }))
                }
              >
                <Text>
                  {new Date(date.endDate + "T" + date.endTime)
                    .toLocaleTimeString("vi-VN")
                    .slice(0, 5)}
                </Text>
              </TouchableOpacity>
              {showPicker.endTime && (
                <DateTimePicker
                  value={new Date(date.endDate + "T" + date.endTime)}
                  mode="time"
                  onChange={(e, date) => {
                    console.log("time: ", date?.toISOString().split("T")[1]);
                    console.log("endTime: ", date);
                    setShowPicker((prev) => ({ ...prev, endTime: false }));
                    if (date)
                      setDate((prev) => ({
                        ...prev,
                        endTime: date?.toISOString().split("T")[1],
                      }));
                  }}
                />
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Đến ngày</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, endDate: true }))
                }
              >
                <Text>
                  {new Date(
                    date.endDate + "T" + date.endTime,
                  ).toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
              {showPicker.endDate && (
                <DateTimePicker
                  value={new Date(date.endDate + "T" + date.endTime)}
                  mode="date"
                  onChange={(e, date) => {
                    setShowPicker((prev) => ({ ...prev, endDate: false }));
                    if (date)
                      setDate((prev) => ({
                        ...prev,
                        endDate: date?.toISOString().split("T")[0],
                      }));
                  }}
                />
              )}
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.labelBold, { marginBottom: 5 }]}>
            Lý do <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Nhập mô tả..."
            value={reason}
            onChangeText={setReason}
          />
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitForm}
        >
          <Text style={styles.submitText}>Gửi đơn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  title: {
    color: "#333333",
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  goBackArrow: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  labelBold: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e8eaef",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#3674B5",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
