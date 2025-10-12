import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { MaterialIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { dtoGetUser, dtoUpdateUser } from "../../../../models/auth/dtoUser";
interface ResumeInfoProps {
  userData: dtoGetUser | undefined;
  onUpdateUserData: (data: dtoUpdateUser) => void;
}
export type MilitaryStatus =
  | "Hoàn thành nghĩa vụ quân sự"
  | "Chưa hoàn thành nghĩa vụ quân sự"
  | "Không có nghĩa vụ quân sự";
export type Nationality =
  | "Việt Nam"
  | "Lào"
  | "Campuchia"
  | "Thái Lan"
  | "Myanmar";
export type Nation =
  | "Kinh"
  | "Tày"
  | "Hoa"
  | "Mường"
  | "Khmer"
  | "Cham"
  | "H'Mông"
  | "Thái"
  | "Dao"
  | "Chăm"
  | "H'Nôm"
  | "Cơ Duyên"
  | "Giáy"
  | "Chu Ru"
  | "Chuơng"
  | "Cơ Ho"
  | "Chu Miêu"
  | "Chu Muổi"
  | "Chu Phan";

const ResumeInfo: React.FC<ResumeInfoProps> = ({
  userData,
  onUpdateUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const initialValues = {
    citizenIdentityCard: userData?.citizenIdentityCard || "",
    issueDate: userData?.issueDate ? new Date(userData.issueDate) : new Date(),
    issueAt: userData?.issueAt || "",
    taxCode: userData?.taxCode || "",
    nationality: userData?.nationality || "",
    nation: userData?.nation || "",
    permanentAddress: userData?.permanentAddress || "",
    currentAddress: userData?.currentAddress || "",
    militaryStatus: userData?.militaryStatus || "",
  };

  const validateSchema = Yup.object().shape({
    citizenIdentityCard: Yup.string()
      .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
      .required("Số CMND/CCCD là bắt buộc"),
    issueDate: Yup.date().required("Ngày cấp là bắt buộc"),
    issueAt: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Nơi cấp là bắt buộc"),
    taxCode: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Mã số thuế là bắt buộc")
      .matches(
        /^[0-9]{10}([0-9]{3})?$/,
        "Mã số thuế phải gồm 10 hoặc 13 chữ số"
      ),
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

  const validate = (values: typeof initialValues) => {
    const errors: any = {};
    try {
      validateSchema.validateSync(values, { abortEarly: false });
    } catch (validationError: any) {
      validationError.inner.forEach((error: any) => {
        errors[error.path] = error.message;
      });
    }
    return errors;
  };

  const handleSubmit = (values: typeof initialValues) => {
    const trimmedValues = {
      ...values,
      citizenIdentityCard: values.citizenIdentityCard.trim(),
      issueAt: values.issueAt.trim(),
      taxCode: values.taxCode.trim(),
      nationality: values.nationality.trim(),
      nation: values.nation.trim(),
      permanentAddress: values.permanentAddress.trim(),
      currentAddress: values.currentAddress.trim(),
      militaryStatus: values.militaryStatus as MilitaryStatus,
      issueDate: values.issueDate,
    };
    const onboardData = { ...userData, ...trimmedValues } as dtoUpdateUser;
    console.log("Form submitted:", onboardData);
    onUpdateUserData(onboardData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Sơ yếu lý lịch</Text>
          {isEditing ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.headerActionButtonCancel}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={20} color="#666" />
                <Text style={styles.headerActionButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButtonSave}
                onPress={formik.submitForm}
              >
                <MaterialIcons name="save" size={20} color="white" />
                <Text style={styles.headerActionButtonSaveText}>Lưu</Text>
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
          <CustomProfileInput
            error={formik.errors.citizenIdentityCard}
            icon="credit-card"
            label="Số CCCD/CMND"
            value={formik.values.citizenIdentityCard}
            onChangeText={(text: string) =>
              formik.setFieldValue("citizenIdentityCard", text)
            }
            iconColor="#3674B5"
            isEditing={isEditing}
          />

          <DatePickerInput
            label="Ngày cấp"
            value={formik.values.issueDate}
            error={formik.errors.issueDate as string}
            onChange={(date: Date) => formik.setFieldValue("issueDate", date)}
            onFocus={() => formik.setFieldTouched("issueDate", true)}
            icon="calendar"
            iconColor="#38A169"
            isEditing={isEditing}
            maximumDate={new Date()}
            placeholder="Chọn ngày cấp"
          />

          <CustomProfileInput
            error={formik.errors.issueAt}
            icon="map-pin"
            label="Nơi cấp"
            value={formik.values.issueAt}
            onChangeText={(text: string) =>
              formik.setFieldValue("issueAt", text)
            }
            iconColor="#3182CE"
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.taxCode}
            icon="credit-card"
            label="Mã số thuế"
            value={formik.values.taxCode}
            onChangeText={(text: string) =>
              formik.setFieldValue("taxCode", text)
            }
            iconColor="#D69E2E"
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.nationality}
            icon="flag"
            label="Quốc tịch"
            value={formik.values.nationality}
            onChangeText={(text: string) =>
              formik.setFieldValue("nationality", text)
            }
            iconColor="#9C27B0"
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.nation}
            icon="users"
            label="Dân tộc"
            value={formik.values.nation}
            onChangeText={(text: string) =>
              formik.setFieldValue("nation", text)
            }
            iconColor="#FF5722"
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.permanentAddress}
            icon="home"
            label="Nơi thường trú"
            value={formik.values.permanentAddress}
            onChangeText={(text: string) =>
              formik.setFieldValue("permanentAddress", text)
            }
            iconColor="#607D8B"
            multiline
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.currentAddress}
            icon="map-pin"
            label="Địa chỉ hiện tại"
            value={formik.values.currentAddress}
            onChangeText={(text: string) =>
              formik.setFieldValue("currentAddress", text)
            }
            iconColor="#795548"
            multiline
            isEditing={isEditing}
          />

          <CustomProfileInput
            error={formik.errors.militaryStatus}
            icon="shield"
            label="Tình trạng quân dịch"
            value={formik.values.militaryStatus}
            onChangeText={(text: string) =>
              formik.setFieldValue("militaryStatus", text)
            }
            iconColor="#3F51B5"
            isEditing={isEditing}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 250, // Extra space for keyboard
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
    gap: 8,
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
  headerActionButtonCancel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerActionButtonCancelText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  headerActionButtonSave: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D69E2E",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerActionButtonSaveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 3,
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
