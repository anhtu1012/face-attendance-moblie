import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateFormPage() {
  const insets = useSafeAreaInsets();
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const formTypes = [
    {
      id: "leave",
      title: "Đơn xin nghỉ phép",
      description: "Xin nghỉ phép có lương/không lương",
      icon: "calendar",
      color: "#4CAF50",
    },
    {
      id: "overtime",
      title: "Đơn xin làm thêm giờ",
      description: "Đăng ký làm thêm giờ",
      icon: "clock-circle",
      color: "#2196F3",
    },
    {
      id: "business",
      title: "Đơn xin công tác",
      description: "Xin đi công tác",
      icon: "car",
      color: "#FF9800",
    },
    {
      id: "other",
      title: "Đơn khác",
      description: "Các loại đơn khác",
      icon: "file-text",
      color: "#9C27B0",
    },
  ];

  const handleSubmit = useCallback(() => {
    if (!selectedFormType || !reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    Alert.alert("Thành công", "Đơn của bạn đã được gửi thành công!", [
      {
        text: "OK",
        onPress: () => {
          setSelectedFormType(null);
          setReason("");
          setFromDate("");
          setToDate("");
        },
      },
    ]);
  }, [selectedFormType, reason]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Reset form data
      setSelectedFormType(null);
      setReason("");
      setFromDate("");
      setToDate("");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Thành công", "Form đã được làm mới!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể làm mới form. Vui lòng thử lại.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3674B5"]}
          tintColor="#3674B5"
          title="Đang tải..."
          titleColor="#3674B5"
        />
      }
    >
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <Text style={styles.headerTitle}>Tạo đơn mới</Text>
        <Text style={styles.headerSubtitle}>Chọn loại đơn bạn muốn tạo</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Loại đơn</Text>

        <View style={styles.formTypesGrid}>
          {formTypes.map((formType) => (
            <TouchableOpacity
              key={formType.id}
              style={[
                styles.formTypeCard,
                selectedFormType === formType.id && styles.selectedFormType,
              ]}
              onPress={() => setSelectedFormType(formType.id)}
            >
              <LinearGradient
                colors={[formType.color, `${formType.color}CC`]}
                style={styles.formTypeIcon}
              >
                <AntDesign name={formType.icon as any} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.formTypeTitle}>{formType.title}</Text>
              <Text style={styles.formTypeDescription}>
                {formType.description}
              </Text>
              {selectedFormType === formType.id && (
                <View style={styles.selectedIndicator}>
                  <AntDesign name="check" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedFormType && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

            {(selectedFormType === "leave" ||
              selectedFormType === "business") && (
              <View style={styles.dateSection}>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Từ ngày</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="dd/mm/yyyy"
                    value={fromDate}
                    onChangeText={setFromDate}
                  />
                </View>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Đến ngày</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="dd/mm/yyyy"
                    value={toDate}
                    onChangeText={setToDate}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Lý do</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập lý do..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={["#4CAF50", "#45a049"]}
                style={styles.submitButtonGradient}
              >
                <MaterialIcons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Gửi đơn</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewFormsButton}
          onPress={() => router.push("/form-list" as any)}
        >
          <AntDesign name="unordered-list" size={20} color="#3674B5" />
          <Text style={styles.viewFormsButtonText}>Xem danh sách đơn</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  formTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  formTypeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  selectedFormType: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  formTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  formTypeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  formTypeDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  viewFormsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  viewFormsButtonText: {
    color: "#3674B5",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
