import { Entypo, AntDesign, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { FormDetail } from "..";

export default function FormDetailScreen() {
  const params = useLocalSearchParams();
  const formData = params as unknown as FormDetail;

  const handleRenderFormState = () => {
    if (formData.status == "PENDING") {
      return (
        <View
          style={[
            styles.tickContainer,
            {
              backgroundColor: "rgba(255, 180, 10, 0.1)",
            },
          ]}
        >
          <AntDesign
            name="clock-circle"
            size={16}
            color="#ffb40a"
            style={{ marginRight: 3 }}
          />
          <Text style={{ color: "#ffb40a" }}>Đang chờ</Text>
        </View>
      );
    } else if (formData.status == "REJECTED")
      return (
        <View
          style={[
            styles.tickContainer,
            {
              backgroundColor: "rgba(242, 95, 108, 0.1)",
            },
          ]}
        >
          <Entypo name="circle-with-cross" size={16} color="#f25f6c" />
          <Text style={{ color: "#f25f6c" }}>Từ chối</Text>
        </View>
      );

    return (
      <View
        style={[
          styles.tickContainer,
          {
            backgroundColor: "rgba(96, 208, 152, 0.1)",
          },
        ]}
      >
        <Entypo name="check" size={16} color="#60d098" />
        <Text style={{ color: "#60d098" }}>Đã duyệt</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign
              name="arrow-left"
              size={24}
              color="#333"
              style={styles.goBackArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết form</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.formTitle}>{formData.formCategoryTitle}</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Ngày gửi đơn</Text>
            <Text style={styles.value}>
              {new Date(formData.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày bắt đầu</Text>
            <Text style={styles.value}>
              {new Date(formData.startTime).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày kết thúc</Text>
            <Text style={styles.value}>
              {new Date(formData.endTime).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Người gửi</Text>
            <Text style={styles.value}>{formData.submittedName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Người duyệt</Text>
            <Text style={styles.value}>{formData.approvedName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái</Text>
            {handleRenderFormState()}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lý do</Text>
            <Text style={styles.reason}>{formData.reason}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phản hồi</Text>
            {formData.response ? (
              <Text style={styles.reason}>{formData.response}</Text>
            ) : (
              <Text style={styles.noText}>Không có phản hồi</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tệp đính kèm</Text>
            <View style={styles.fileItem}>
              <Feather name="file-text" size={18} color="#555" />
              <Text style={styles.fileName}>{formData.file}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  goBackArrow: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#777",
  },
  value: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  status: {
    fontSize: 15,
    fontWeight: "bold",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  reason: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  fileName: {
    marginLeft: 6,
    fontSize: 15,
    color: "#007AFF",
  },

  tickContainer: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    gap: 3,
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 5,
  },
  noText: {
    fontStyle: "italic",
  },
});
