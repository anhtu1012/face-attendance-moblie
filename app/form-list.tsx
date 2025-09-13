import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FormListScreen() {
  const insets = useSafeAreaInsets();

  const forms = [
    {
      id: "1",
      title: "Đơn xin nghỉ phép",
      status: "Đã duyệt",
      date: "15/11/2024",
    },
    {
      id: "2",
      title: "Đơn xin làm thêm giờ",
      status: "Chờ duyệt",
      date: "18/11/2024",
    },
    {
      id: "3",
      title: "Đơn xin công tác",
      status: "Từ chối",
      date: "20/11/2024",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return "#4CAF50";
      case "Chờ duyệt":
        return "#FF9800";
      case "Từ chối":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách đơn</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {forms.map((form) => (
          <TouchableOpacity
            key={form.id}
            style={styles.formCard}
            onPress={() => router.push("/form-detail-view" as any)}
          >
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{form.title}</Text>
              <Text style={styles.formDate}>{form.date}</Text>
            </View>
            <View style={styles.formFooter}>
              <Text
                style={[
                  styles.formStatus,
                  { color: getStatusColor(form.status) },
                ]}
              >
                {form.status}
              </Text>
              <AntDesign name="right" size={16} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  formDate: {
    fontSize: 12,
    color: "#666",
  },
  formFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
});
