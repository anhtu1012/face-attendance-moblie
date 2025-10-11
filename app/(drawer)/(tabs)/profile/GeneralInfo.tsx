import CustomProfileInput from "@/components/ui/CustomProfileInput";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { RadioGroup } from "../../../../components/ui/RadioButton";
import { dtoGetUser, dtoUpdateUser } from "../../../../models/auth/dtoUser";
interface GeneralInfoProps {
  userData: dtoGetUser | undefined;
  onUpdateUserData: (data: dtoUpdateUser) => void;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
  userData,
  onUpdateUserData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMarriedStatusDropdown, setShowMarriedStatusDropdown] =
    useState(false);
  const updateUser = useUpdateUser();
  const MARRIED_STATUS_OPTIONS = [
    { label: "Độc thân", value: "Độc thân" },
    { label: "Đã kết hôn", value: "Đã kết hôn" },
    { label: "Đã ly hôn", value: "Đã ly hôn" },
  ];
  const initialValues = {
    fullName: userData?.fullName || "--",
    email: userData?.email || "--",
    phone: userData?.phone || "--",
    birthday: userData?.birthday || "--",
    gender: userData?.gender || "--",
    marriedStatus: userData?.marriedStatus || "--",
    bankingAccountNo: userData?.bankingAccountNo || "--",
    bankingAccountName: userData?.bankingAccountName || "--",
    bankingName: userData?.bankingName || "--",
  };
  const validateSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Họ và tên là bắt buộc")
      .matches(/^[\p{L}\s'-]+$/u, "Tên không hợp lệ"),
    email: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .email("Email không hợp lệ")
      .required("Email là bắt buộc")
      .matches(
        /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Bạn phải cung cấp một địa chỉ email hợp lệ"
      ),
    phone: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại là bắt buộc"),
    birthday: Yup.date().required("Ngày sinh là bắt buộc"),
    gender: Yup.string().required("Giới tính là bắt buộc"),
    marriedStatus: Yup.string().required("Tình trạng hôn nhân là bắt buộc"),
    bankingAccountNo: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Số tài khoản là bắt buộc")
      .matches(/^[0-9]{10,11}$/, "Số tài khoản không hợp lệ"),
    bankingAccountName: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Tên tài khoản là bắt buộc")
      .matches(/^[\p{L}\s'-]+$/u, "Tên không được chứa ký tự đặc biệt hoặc số"),
    bankingName: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Tên ngân hàng là bắt buộc")
      .matches(/^[\p{L}\s'-]+$/u, "Tên không được chứa ký tự đặc biệt hoặc số"),
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

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  const handleSubmit = (values: typeof initialValues) => {
    const trimmedValues = {
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      marriedStatus: values.marriedStatus as
        | "Đã kết hôn"
        | "Độc thân"
        | "Đã ly hôn",
      phone: values.phone.trim(),
      bankingAccountNo: values.bankingAccountNo.trim(),
      bankingAccountName: values.bankingAccountName.trim(),
      bankingName: values.bankingName.trim(),
      gender: values.gender as "M" | "F",
      birthday: values.birthday,
      dependent: [],
    };
    const onboardData = { ...userData, ...trimmedValues } as dtoUpdateUser;
    console.log("Form submitted:", onboardData);
    updateUser.mutate({
      userId: "13",
      onboardData: onboardData,
    });
    onUpdateUserData(onboardData);
    setIsEditing(false);
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const CustomDropdown = ({
    error,
    icon,
    label,
    iconColor,
    value,
    options,
    onSelect,
    placeholder = "Chọn tình trạng",
  }: any) => (
    <View style={[styles.infoItem, error && { borderBottomColor: "#FF4D4F" }]}>
      <View style={styles.infoIconContainer}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowMarriedStatusDropdown(true)}
          >
            <Text
              style={[styles.dropdownText, !value && styles.placeholderText]}
            >
              {value || placeholder}
            </Text>
            <Feather name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        ) : (
          <Text style={[styles.infoValue, error && { color: "#FF4D4F" }]}>
            {value || "Chưa cập nhật"}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Thông tin chung</Text>
        {isEditing ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.headerActionButtonSave}
              onPress={formik.submitForm}
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
        <CustomProfileInput
          error={formik.errors.fullName}
          icon="person-outline"
          label="Họ và tên"
          value={formik.values.fullName || "--"}
          onChangeText={(text: string) =>
            formik.setFieldValue("fullName", text)
          }
          iconColor="#3674B5"
          keyboardType="email-address"
          isEditing={isEditing}
        />
        <CustomProfileInput
          error={formik.errors.email}
          icon="mail"
          label="Email"
          value={formik.values.email || "--"}
          onChangeText={(text: string) => formik.setFieldValue("email", text)}
          iconColor="#E53E3E"
          keyboardType="email-address"
          isEditing={isEditing}
        />

        <CustomProfileInput
          error={formik.errors.phone}
          icon="phone"
          label="Điện thoại"
          value={formik.values.phone || "--"}
          onChangeText={(text: string) => formik.setFieldValue("phone", text)}
          iconColor="#38A169"
          keyboardType="phone-pad"
          isEditing={isEditing}
        />

        <CustomProfileInput
          error={formik.errors.birthday}
          icon="calendar"
          label="Ngày sinh"
          value={formatDate(formik.values.birthday as Date)}
          iconColor="#D69E2E"
          isEditing={isEditing}
        />
        {/* Gender Selection */}
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="person-outline" size={20} color="#4CAF50" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Giới tính</Text>
            {isEditing ? (
              <RadioGroup
                options={[
                  { label: "Nam", value: "M" },
                  { label: "Nữ", value: "F" },
                ]}
                selectedValue={formik.values.gender}
                onValueChange={(value) =>
                  formik.setFieldValue("gender", value as "M" | "F")
                }
                direction="row"
                containerStyle={styles.radioGroupContainer}
                itemStyle={styles.radioItem}
              />
            ) : (
              <Text style={styles.infoValue}>
                {formik.values.gender === "M"
                  ? "Nam"
                  : formik.values.gender === "F"
                  ? "Nữ"
                  : "Không xác định"}
              </Text>
            )}
          </View>
        </View>

        <CustomDropdown
          error={formik.errors.marriedStatus}
          icon="heart"
          label="Tình trạng hôn nhân"
          value={formik.values.marriedStatus || "--"}
          options={MARRIED_STATUS_OPTIONS}
          onSelect={(value: string) =>
            formik.setFieldValue("marriedStatus", value)
          }
          iconColor="#E91E63"
          isEditing={isEditing}
        />
      </View>
      <Modal
        visible={showMarriedStatusDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMarriedStatusDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMarriedStatusDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Chọn tình trạng hôn nhân</Text>
              <TouchableOpacity
                onPress={() => setShowMarriedStatusDropdown(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={MARRIED_STATUS_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    formik.values.marriedStatus === item.value &&
                      styles.selectedItem,
                  ]}
                  onPress={() => {
                    formik.setFieldValue("marriedStatus", item.value);
                    setShowMarriedStatusDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      formik.values.marriedStatus === item.value &&
                        styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {formik.values.marriedStatus === item.value && (
                    <Feather name="check" size={16} color="#3674B5" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>
      </View>

      <View style={styles.infoCard}>
        <CustomProfileInput
          error={formik.errors.bankingAccountNo}
          icon="credit-card"
          label="Số tài khoản"
          value={formik.values.bankingAccountNo || "--"}
          iconColor="#9C27B0"
          isEditing={isEditing}
        />
        <CustomProfileInput
          error={formik.errors.bankingAccountName}
          icon="user"
          label="Tên tài khoản"
          value={formik.values.bankingAccountName || "--"}
          iconColor="#FF5722"
          isEditing={isEditing}
        />
        <CustomProfileInput
          error={formik.errors.bankingName}
          icon="building"
          label="Tên ngân hàng"
          value={formik.values.bankingName || "--"}
          iconColor="#607D8B"
          isEditing={isEditing}
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
  radioGroupContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  radioItem: {
    marginRight: 20,
  },
  // Dropdown styles
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 40,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: 300,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedItem: {
    backgroundColor: "#f8f9fa",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedItemText: {
    color: "#3674B5",
    fontWeight: "500",
  },
});

export default GeneralInfo;
