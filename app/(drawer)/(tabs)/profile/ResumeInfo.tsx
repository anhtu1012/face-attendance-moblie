import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { dtoGetUser, dtoUpdateUser } from "../../../../models/auth/dtoUser";
import * as Yup from "yup";
interface ResumeInfoProps {
  userData: dtoGetUser | undefined;
  onUpdateUserData: (data: dtoUpdateUser) => void;
}
export type MilitaryStatus = "Hoàn thành nghĩa vụ quân sự" | "Chưa hoàn thành nghĩa vụ quân sự" | "Không có nghĩa vụ quân sự";
export type Nationality = "Việt Nam" | "Lào" | "Campuchia" | "Thái Lan" | "Myanmar";
export type Nation = "Kinh" | "Tày" | "Hoa" | "Mường" | "Khmer" | "Cham" | "H'Mông" | "Thái" | "Dao" | "Chăm" | "H'Nôm" | "Cơ Duyên" | "Giáy" | "Chu Ru" | "Chuơng" | "Cơ Ho" | "Chu Miêu" | "Chu Muổi" | "Chu Phan";

const ResumeInfo: React.FC<ResumeInfoProps> = ({
  userData,
  onUpdateUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<dtoUpdateUser>(userData as dtoUpdateUser);
  const handleSave = () => {
    onUpdateUserData(editData);
    setIsEditing(false);
  };
  const CustomResumeInfoInput = ({
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
  const initialValues = {
    citizenIdentityCard: userData?.citizenIdentityCard || "--",
    issueDate: userData?.issueDate || "--",
    issueAt: userData?.issueAt || "--",
    taxCode: userData?.taxCode || "--",
    nationality: userData?.nationality || "--",
    nation: userData?.nation || "--",
    permanentAddress: userData?.permanentAddress || "--",
    currentAddress: userData?.currentAddress || "--",
    militaryStatus: userData?.militaryStatus || "--",
  };
  const validateSchema = Yup.object().shape({
    itizenIdentityCard: Yup.string()
      .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
      .required("Số CMND/CCCD là bắt buộc"),
    issueDate: Yup.date().required("Ngày cấp là bắt buộc"),
    issueAt: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Nơi cấp là bắt buộc"),
    taxCode: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Mã số thuế là bắt buộc")
      .matches(/^[0-9]{10}([0-9]{3})?$/, "Mã số thuế phải gồm 10 hoặc 13 chữ số"),
    nationality: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Quốc tịch là bắt buộc"),
    nation: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Dân tộc là bắt buộc"),
    permanentAddress: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Địa chỉ thường trú là bắt buộc"),
    currentAddress: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Địa chỉ hiện tại là bắt buộc"),    
    militaryStatus: Yup.string().required("Tình trạng quân dịch là bắt buộc"),
  });

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Sơ yếu lý lịch</Text>
        {isEditing ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.headerActionButtonSave}
              onPress={handleSave}
            >
              <MaterialIcons name="save" size={24} color="white" />
              <Text style={styles.headerActionButtonSaveText}>
                Lưu thay đổi
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerActionButtonEdit}
            onPress={() => setIsEditing(true)}
          >
            <MaterialIcons name="edit" size={24} color="#3674B5" />
            <Text style={styles.headerActionButtonEditText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.infoCard}>
        <CustomResumeInfoInput
          error={null}
          icon="credit-card"
          label="Số CCCD/CMND"
          value={editData?.citizenIdentityCard || "--"}
          onChangeText={(text: string) =>
            setEditData({ ...editData, citizenIdentityCard: text })
          }
          iconColor="#3674B5"
        />

        <CustomResumeInfoInput
          error={null}
          icon="calendar"
          label="Ngày cấp"
          value={
            editData?.issueDate
              ? new Date(editData.issueDate).toLocaleDateString("vi-VN")
              : ""
          }
          iconColor="#38A169"
        />

        <CustomResumeInfoInput
          error={null}
          icon="map-pin"
          label="Nơi cấp"
          value={editData?.issueAt || "--"}
          onChangeText={(text: string) => setEditData({ ...editData, issueAt: text })}
          iconColor="#3182CE"
        />

        <CustomResumeInfoInput
          error={null}
          icon="credit-card"
          label="Mã số thuế"
          value={editData?.taxCode || "--"}
          onChangeText={(text: string) => setEditData({ ...editData, taxCode: text })}
          iconColor="#D69E2E"
        />

        <CustomResumeInfoInput
          error={null}
          icon="flag"
          label="Quốc tịch"
          value={editData?.nationality || "--"}
          onChangeText={(text: Nationality) =>
            setEditData({ ...editData, nationality: text })
          }
          iconColor="#9C27B0"
        />

        <CustomResumeInfoInput
          error={null}
          icon="users"
          label="Dân tộc"
          value={editData?.nation || "--"}
          onChangeText={(text: Nation) => setEditData({ ...editData, nation: text })}
          iconColor="#FF5722"
        />

        <CustomResumeInfoInput
          error={null}
          icon="home"
          label="Nơi thường trú"
          value={editData?.permanentAddress || "--"}
          onChangeText={(text: string) =>
            setEditData({ ...editData, permanentAddress: text })
          }
          iconColor="#607D8B"
          multiline
        />

        <CustomResumeInfoInput
          error={null}
          icon="map-pin"
          label="Địa chỉ hiện tại"
          value={editData?.currentAddress || "--"}
          onChangeText={(text: string) =>
            setEditData({ ...editData, currentAddress: text })
          }
          iconColor="#795548"
          multiline
        />

        <CustomResumeInfoInput
          error={null}
          icon="shield"
          label="Tình trạng quân dịch"
          value={editData?.militaryStatus || "--"}
          onChangeText={(text: MilitaryStatus) =>
            setEditData({ ...editData, militaryStatus: text as MilitaryStatus })
          }
          iconColor="#3F51B5"
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

export default ResumeInfo;
