import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { dtoUserOnboard } from "../../../../models/auth/dtoUser";

interface WorkContractInfoProps {
  userData: dtoUserOnboard;
  onUpdateUserData: (data: dtoUserOnboard) => void;
}

const WorkContractInfo: React.FC<WorkContractInfoProps> = ({
  userData,
  onUpdateUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<dtoUserOnboard>(userData);

  const handleSave = () => {
    onUpdateUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const CustomWorkInfoInput = ({
    error,
    icon,
    label,
    iconColor,
    keyboardType = "default",
    ...props
  }: any) => (
    <View style={[styles.infoItem, error && { borderBottomColor: "#FF4D4F" }]}>
      <View style={styles.infoIconContainer}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.infoValue,
              error && { color: "#FF4D4F" },
              {
                borderBottomWidth: 1,
                borderBottomColor: error ? "#FF4D4F" : "black",
              },
            ]}
            {...props}
          />
        ) : (
          <Text style={[styles.infoValue, error && { color: "#FF4D4F" }]}>
            {props.value || "Chưa cập nhật"}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Công việc & Hợp đồng</Text>
      </View>

      {/* Content */}
      <View style={styles.infoCard}>
        <CustomWorkInfoInput
          error={null}
          icon="briefcase"
          label="Vị trí công việc"
          value="Nhân viên Fulltime"
          iconColor="#3674B5"
        />

        <CustomWorkInfoInput
          error={null}
          icon="building"
          label="Phòng ban"
          value="Phòng Nhân sự"
          iconColor="#38A169"
        />

        <CustomWorkInfoInput
          error={null}
          icon="calendar"
          label="Ngày bắt đầu làm việc"
          value="01/01/2024"
          iconColor="#3182CE"
        />

        <CustomWorkInfoInput
          error={null}
          icon="file-text"
          label="Loại hợp đồng"
          value="Hợp đồng lao động không xác định thời hạn"
          iconColor="#D69E2E"
        />

        <CustomWorkInfoInput
          error={null}
          icon="dollar-sign"
          label="Mức lương"
          value="15,000,000 VNĐ"
          iconColor="#9C27B0"
        />

        <CustomWorkInfoInput
          error={null}
          icon="clock"
          label="Thời gian làm việc"
          value="8:00 - 17:00 (Thứ 2 - Thứ 6)"
          iconColor="#FF5722"
        />

        <CustomWorkInfoInput
          error={null}
          icon="user-check"
          label="Người quản lý trực tiếp"
          value="Nguyễn Văn A - Trưởng phòng"
          iconColor="#607D8B"
        />

        <CustomWorkInfoInput
          error={null}
          icon="map-pin"
          label="Địa điểm làm việc"
          value="Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM"
          iconColor="#795548"
          multiline
        />

        <CustomWorkInfoInput
          error={null}
          icon="award"
          label="Phúc lợi"
          value="Bảo hiểm xã hội, Bảo hiểm y tế, Bảo hiểm thất nghiệp, Nghỉ phép năm"
          iconColor="#3F51B5"
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerActionButtonEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  headerActionButtonEditText: {
    color: "#3674B5",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerActionButtonSave: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D69E2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerActionButtonSaveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerActionButtonCancel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E53E3E",
  },
  headerActionButtonCancelText: {
    color: "#E53E3E",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default WorkContractInfo;
