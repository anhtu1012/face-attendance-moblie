import AlertModal from "@/components/ui/AlertModal";
import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import { DEFAULT_ISSUE_AT } from "@/constants/resume";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { MILITARY_STATUS_OPTIONS } from "@/models/data/militaryStatus";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
import { dtoUpdateUser } from "../../../models/auth/dtoUser";
import AppendixTab from "./profile/AppendixTab";
import DependentInfo from "./profile/DependentInfo";
import GeneralInfo from "./profile/GeneralInfo";
import ResumeInfo from "./profile/ResumeInfo";
import WorkContractInfo from "./profile/WorkContractInfo";
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const {
    userProfile: userData,
    isLoading,
    error,
    refetch,
    userId,
  } = useGetUserProfile();
  const updateUser = useUpdateUser();
  const [showAlertModal, setShowAlertModal] = useState({
    visible: false,
    message: "",
    type: "success",
    title: "",
  });

  const tabs = [
    { id: 0, title: "Thông tin chung" },
    { id: 1, title: "Sơ yếu lý lịch" },
    { id: 2, title: "Người phụ thuộc" },
    { id: 3, title: "Hợp đồng" },
    { id: 4, title: "Phụ lục hợp đồng" },
  ];
  const initialValues = {
    email: userData?.email || "",
    phone: userData?.phone || "",
    marriedStatus: userData?.marriedStatus || "",
    bankingAccountNo: userData?.bankingAccountNo || "",
    bankingAccountName: userData?.bankingAccountName || "",
    bankingName: userData?.bankingName || "",
    taxCode: userData?.taxCode || "",
    militaryStatus: userData?.militaryStatus || "",
    citizenIdentityCard: userData?.citizenIdentityCard || "--",
    issueDate: userData?.issueDate ? new Date(userData.issueDate) : new Date(),
    issueAt: userData?.issueAt || DEFAULT_ISSUE_AT,
    nationality: userData?.nationality || "",
    nation: userData?.nation || "",
    permanentAddress: userData?.permanentAddress || "",
    currentAddress: userData?.currentAddress || "",
    fullName: userData?.fullName || "",
    birthday: userData?.birthday || new Date(),
    gender: userData?.gender || "",
  };
  const validateSchema = Yup.object().shape({
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
    taxCode: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Mã số thuế là bắt buộc")
      .matches(
        /^[0-9]{10}([0-9]{3})?$/,
        "Mã số thuế phải gồm 10 hoặc 13 chữ số"
      ),
    militaryStatus: Yup.string()
      .required("Tình trạng quân dịch là bắt buộc")
      .oneOf(
        MILITARY_STATUS_OPTIONS.map((option) => option.value),
        "Tình trạng quân dịch không hợp lệ"
      ),
    citizenIdentityCard: Yup.string()
      .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
      .required("Số CMND/CCCD là bắt buộc"),
    issueDate: Yup.date().required("Ngày cấp là bắt buộc"),
    issueAt: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Nơi cấp là bắt buộc"),

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
    birthday: Yup.date().required("Ngày sinh là bắt buộc"),
    gender: Yup.string().required("Giới tính là bắt buộc"),
    fullName: Yup.string()
      .trim("Không được chứa khoảng trắng thừa")
      .required("Họ và tên là bắt buộc")
      .matches(/^[\p{L}\s'-]+$/u, "Tên không hợp lệ"),
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
      email: values.email.trim(),
      marriedStatus: values.marriedStatus as
        | "Đã kết hôn"
        | "Độc thân"
        | "Đã ly hôn",
      phone: values.phone.trim(),
      bankingAccountNo: values.bankingAccountNo.trim(),
      bankingAccountName: values.bankingAccountName.trim(),
      bankingName: values.bankingName.trim(),
      dependent: [],
      taxCode: values.taxCode.trim(),
      militaryStatus: values.militaryStatus,
      citizenIdentityCard: values.citizenIdentityCard.trim(),
      nationality: values.nationality.trim(),
      nation: values.nation.trim(),
      permanentAddress: values.permanentAddress.trim(),
      currentAddress: values.currentAddress.trim(),
      issueDate: values.issueDate,
      fullName: values.fullName.trim(),
      birthday: values.birthday,
      gender: values.gender,
      issueAt: DEFAULT_ISSUE_AT,
    };
    const onboardData = { ...userData, ...trimmedValues } as dtoUpdateUser;
    updateUser.mutate(
      {
        userId: userId || "",
        onboardData: onboardData,
      },
      {
        onSuccess: () => {
          setShowAlertModal({
            visible: true,
            message: "Thông tin cá nhân đã được cập nhật thành công!",
            type: "success",
            title: "Thông báo",
          });
        },
        onError: () => {
          setShowAlertModal({
            visible: true,
            message: "Lỗi khi cập nhật thông tin cá nhân",
            type: "error",
            title: "Thông báo",
          });
        },
      }
    );
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <GeneralInfo formik={formik} isEditing={isEditing} />;
      case 1:
        return <ResumeInfo formik={formik} isEditing={isEditing} />;
      case 2:
        return <DependentInfo userId={userId || ""} />;
      case 3:
        return (
          <WorkContractInfo userId={userId} gmail={userData?.email || ""} />
        );
      case 4:
        return <AppendixTab userId={userId} gmail={userData?.email || ""} />;
      default:
        return <GeneralInfo formik={formik} isEditing={isEditing} />;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <CustomHeaders
        title="Thông tin nhân sự"
        onBack={() => router.navigate("/(drawer)/(tabs)")}
      />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              userData?.faceImg
                ? { uri: userData?.faceImg }
                : require("../../../assets/images/empty-avatar.png")
            }
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userData?.fullName || "--"}</Text>
          <Text style={styles.profilePosition}>Nhân viên</Text>
          <Text style={styles.profileCode}>Mã: {userData?.id || "--"}</Text>
          <View style={styles.statusContainer}></View>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.spacer} />
          {isEditing ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.headerActionButtonCancel}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButtonSave}
                onPress={formik.submitForm}
              >
                <MaterialIcons name="save" size={16} color="white" />
                <Text style={styles.headerActionButtonSaveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.headerActionButtonEdit}
              onPress={() => setIsEditing(true)}
            >
              <MaterialIcons name="edit" size={16} color="#3674B5" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}
      </ScrollView>
      <AlertModal
        visible={showAlertModal.visible}
        onClose={() => {
          setShowAlertModal({
            visible: false,
            message: "",
            type: "success",
            title: "",
          });
        }}
        type={showAlertModal.type as "success" | "error" | "warning" | "info"}
        title={showAlertModal.title}
        message={showAlertModal.message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#3674B5",
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  profilePosition: {
    fontSize: 12,
    color: "#666",
    marginBottom: 1,
  },
  profileCode: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
  },
  statusContainer: {
    alignSelf: "flex-start",
  },
  statusBadge: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 2,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 40, // Extra space to indicate scrollable
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    position: "relative",
    minWidth: 80, // Reduced minimum width
  },
  activeTabButton: {
    // No background color for active state
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  activeTabButtonText: {
    color: "#3674B5",
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: "#3674B5",
    borderRadius: 1,
  },
  scrollIndicator: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -10 }],
    backgroundColor: "rgba(54, 116, 181, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scrollIndicatorText: {
    color: "#3674B5",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerActionButtonEdit: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
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
    borderRadius: 4,
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
  headerActions: {
    flexDirection: "column",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 2,
    gap: 8,
  },
  spacer: {
    flex: 1,
  },
});
