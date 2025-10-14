import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { submitForm } from "@/services/form/api";
import MultiFileInput from "@/components/MultiFileInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { createZip } from "@/utils/zipUtils";
import AlertModal, {
  AlertModalProps,
  initialModalValue,
} from "@/components/ui/AlertModal";

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
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [showPicker, setShowPicker] = useState<ShowPickerType>(
    initialShowPickerValue,
  );
  const [modal, setModal] = useState<AlertModalProps>({
    visible: false,
    message: "",
    type: "success",
    title: "",
    onClose: () => setModal(initialModalValue),
  });
  const [loading, setLoading] = useState(false);

  const handleZipFiles = async () => {
    const imagePaths = files.reduce(
      (acc, curr) => [...acc, curr.uri],
      [] as string[],
    );
    const zipUri = await createZip(imagePaths);
    return zipUri;
  };

  const handleSubmitForm = async () => {
    // Get user profile
    const userProfile = await AsyncStorage.getItem("userProfile");
    const user = JSON.parse(userProfile!);

    // Get zip image folder uri
    const zipUri = await handleZipFiles();
    console.log("zipUri: ", zipUri);

    const formData = new FormData();
    formData.append("formId", id as string);
    formData.append("submittedById", user.id);
    formData.append("reason", reason);
    formData.append("fileEvidence", {
      uri: zipUri,
      name: "faces.zip",
      type: "application/zip",
    } as any);
    formData.append(
      "startTime",
      new Date(date.startDate + "T" + date.startTime).toISOString(),
    );
    formData.append(
      "endTime",
      new Date(date.endDate + "T" + date.endTime).toISOString(),
    );

    try {
      // Set loading state
      setLoading(true);
      console.log("FormData: ", formData);

      await submitForm(formData);
      console.log("Gửi đơn thành công");
      setReason("");
      setDate(initialDateValue);
      setFiles([]);
      setModal((prev) => ({
        ...prev,
        visible: true,
        title: "Thành công",
        message: "Gửi đơn thành công",
        onClose: () => setModal(initialModalValue),
      }));
    } catch (error: any) {
      console.log("Không thể gửi đơn");
      console.log(error);

      // Set error modal
      setModal((prev) => ({
        ...prev,
        visible: true,
        type: "error",
        title: "Thất bại",
        message: "Lỗi khi gửi đơn",
        onClose: () => setModal(initialModalValue),
      }));
    } finally {
      setLoading(false);
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

      {/* Alert modal */}
      <AlertModal {...modal} />

      {/* form detail */}
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.labelBold}>Thời gian</Text>
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
          <Text style={[styles.labelBold, { marginBottom: 5, marginLeft: 4 }]}>
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

        {/* Files */}
        <View style={styles.inputGroup}>
          <MultiFileInput files={files} setFiles={setFiles} />
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitForm}
        >
          <Text style={styles.submitText}>Gửi đơn</Text>
        </TouchableOpacity>

        {/* Loading spinner */}
        {loading && (
          <View style={styles.overlay}>
            <View style={styles.spinnerBox}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Đang gửi đơn...</Text>
            </View>
          </View>
        )}
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
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.4)", // dim effect
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  spinnerBox: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 15,
  },
});
