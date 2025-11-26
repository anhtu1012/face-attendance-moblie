import MultiFileInput from "@/components/MultiFileInput";
import AlertModal, {
  AlertModalProps,
  initialModalValue,
} from "@/components/ui/AlertModal";
import CustomHeaders from "@/components/ui/CustomHeaders";
import { submitForm } from "@/services/form/api";
import { createZip } from "@/utils/zipUtils";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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
  const insets = useSafeAreaInsets();
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
    const zipUri = files.length ? await handleZipFiles() : "";
    console.log("zipUri: ", zipUri);

    const formData = new FormData();
    formData.append("formId", id as string);
    formData.append("submittedById", user.id);
    formData.append("reason", reason);
    zipUri?.length
      ? formData.append("fileEvidence", {
          uri: zipUri,
          name: "faces.zip",
          type: "application/zip",
        } as any)
      : null;
    formData.append(
      "startTime",
      new Date(date.startDate + "T" + date.startTime).toISOString(),
    );
    formData.append(
      "endTime",
      new Date(date.endDate + "T" + date.endTime).toISOString(),
    );
    // formData.append("date", new Date().toISOString());
    formData.append(
      "date",
      new Date(date.startDate + "T" + date.startTime).toISOString(),
    );

    try {
      // Set loading state
      setLoading(true);
      console.log("FormData: ", formData);

      await submitForm(formData);
      console.log("Gửi đơn thành công");

      // Clear form
      setReason("");
      setDate(initialDateValue);
      setFiles([]);

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Gửi đơn thành công!",
        text2: "Đơn của bạn đã được gửi và đang chờ duyệt",
        topOffset: insets.top + 10,
        visibilityTime: 3000,
      });

      // Navigate back to home page
      // setTimeout(() => {
      router.push({
        pathname: "/(drawer)/(tabs)",
        params: {
          refetchForms: "true",
        },
      });
      // }, 500);
    } catch (error: any) {
      console.log("Không thể gửi đơn");
      console.log(error);

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Không thể gửi đơn",
        text2: error?.response?.data?.message || "Vui lòng thử lại sau",
        topOffset: insets.top + 10,
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modern Gradient Header */}

      <CustomHeaders
        title={`Tạo ${title.toString().toLowerCase()}`}
        onBack={() => router.navigate("/(drawer)/(tabs)/(form)/choose-form")}
      />

      {/* Alert modal */}
      <AlertModal {...modal} />

      {/* form detail */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Period Card */}
        <View style={styles.modernCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#3674B5"
              />
            </View>
            <Text style={styles.cardTitle}>Thời gian</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.modernLabel}>Từ giờ</Text>
              <TouchableOpacity
                style={styles.modernInput}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, startTime: true }))
                }
              >
                <Feather
                  name="clock"
                  size={18}
                  color="#3674B5"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputText}>
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
              <Text style={styles.modernLabel}>Từ ngày</Text>
              <TouchableOpacity
                style={styles.modernInput}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, startDate: true }))
                }
              >
                <Feather
                  name="calendar"
                  size={18}
                  color="#3674B5"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputText}>
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
              <Text style={styles.modernLabel}>Đến giờ</Text>
              <TouchableOpacity
                style={styles.modernInput}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, endTime: true }))
                }
              >
                <Feather
                  name="clock"
                  size={18}
                  color="#3674B5"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputText}>
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
              <Text style={styles.modernLabel}>Đến ngày</Text>
              <TouchableOpacity
                style={styles.modernInput}
                onPress={() =>
                  setShowPicker((prev) => ({ ...prev, endDate: true }))
                }
              >
                <Feather
                  name="calendar"
                  size={18}
                  color="#3674B5"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputText}>
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

        {/* Description Card */}
        <View style={styles.modernCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons
                name="text-box-outline"
                size={20}
                color="#3674B5"
              />
            </View>
            <Text style={styles.cardTitle}>
              Lý do <Text style={{ color: "#FF5252" }}>*</Text>
            </Text>
          </View>
          <TextInput
            style={styles.modernTextArea}
            multiline
            placeholder="Nhập lý do xin nghỉ hoặc đi muộn..."
            placeholderTextColor="#999"
            value={reason}
            onChangeText={setReason}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Files Card */}
        <View style={styles.modernCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color="#3674B5"
              />
            </View>
            <Text style={styles.cardTitle}>Tài liệu đính kèm</Text>
          </View>
          <MultiFileInput files={files} setFiles={setFiles} />
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={styles.modernSubmitButton}
          onPress={handleSubmitForm}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3674B5", "#2196F3"]}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons
              name="send"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.modernSubmitText}>Gửi đơn</Text>
          </LinearGradient>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  // Modern Header Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  // Modern Card Styles
  modernCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // Modern Input Styles
  modernLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  modernInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  modernTextArea: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    fontSize: 15,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  // Row Layout
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  // Modern Submit Button
  modernSubmitButton: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  modernSubmitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Loading Overlay
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
