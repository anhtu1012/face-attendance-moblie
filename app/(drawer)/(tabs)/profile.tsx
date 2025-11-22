import { updateUserImage } from "@/api/user";
import AlertModal from "@/components/ui/AlertModal";
import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import { DEFAULT_ISSUE_AT } from "@/constants/resume";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { MILITARY_STATUS_OPTIONS } from "@/models/data/militaryStatus";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import ResetPassword from "./profile/ResetPassword";
import ResumeInfo from "./profile/ResumeInfo";
import WorkContractInfo from "./profile/WorkContractInfo";
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
    { id: 5, title: "Đặt lại mật khẩu" },
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
    citizenIdentityCard: userData?.citizenIdentityCard || "",
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
        "Bạn phải cung cấp một địa chỉ email hợp lệ",
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
        "Mã số thuế phải gồm 10 hoặc 13 chữ số",
      ),
    militaryStatus: Yup.string()
      .required("Tình trạng quân dịch là bắt buộc")
      .oneOf(
        MILITARY_STATUS_OPTIONS.map((option) => option.value),
        "Tình trạng quân dịch không hợp lệ",
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
      },
    );
    setIsEditing(false);
  };
  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const handleAvatarPress = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== "granted") {
        Alert.alert(
          "Quyền truy cập",
          "Vui lòng cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện",
          [{ text: "OK" }],
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        await uploadAvatar(selectedImage.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const uploadAvatar = async (imageUri: string) => {
    if (!userId) return;

    setIsUploadingAvatar(true);

    try {
      // Create form data
      const formData = new FormData();

      // Get file extension
      const fileExtension = imageUri.split(".").pop() || "jpg";
      const fileName = `avatar_${userId}.${fileExtension}`;

      // Append userId to form data
      formData.append("userId", userId);

      // Append image to form data
      formData.append("faceImg", {
        uri: imageUri,
        type: `image/${fileExtension}`,
        name: fileName,
      } as any);

      // Call API to update avatar
      await updateUserImage(formData as any);

      // Refetch user data to get updated avatar
      await refetch();

      setShowAlertModal({
        visible: true,
        message: "Cập nhật ảnh đại diện thành công!",
        type: "success",
        title: "Thành công",
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setShowAlertModal({
        visible: true,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.",
        type: "error",
        title: "Lỗi",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
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
      case 5:
        return <ResetPassword />;
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
        {/* Gradient Background */}
        <LinearGradient
          colors={["white", "white"]}
          start={{ x: 0.6, y: 0.6 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradientBg}
        />

        {/* Floating Edit Button */}
        {!isEditing ? (
          <TouchableOpacity
            style={styles.floatingEditButton}
            onPress={() => setIsEditing(true)}
          >
            <MaterialIcons name="edit" size={18} color="#3674B5" />
          </TouchableOpacity>
        ) : (
          <View style={styles.floatingEditActions}>
            <TouchableOpacity
              style={styles.floatingCancelButton}
              onPress={handleCancel}
            >
              <MaterialIcons name="close" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.floatingSaveButton}
              onPress={formik.submitForm}
            >
              <MaterialIcons name="check" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Horizontal Layout: Avatar + Info */}
        <View style={styles.profileContent}>
          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={isEditing ? handleAvatarPress : undefined}
            activeOpacity={isEditing ? 0.7 : 1}
            disabled={isUploadingAvatar}
          >
            <Image
              source={
                userData?.faceImg
                  ? { uri: userData?.faceImg }
                  : require("../../../assets/images/empty-avatar.png")
              }
              style={styles.avatarImage}
            />
            {isEditing && (
              <View style={styles.avatarEditOverlay}>
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialIcons name="photo-camera" size={20} color="#fff" />
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {userData?.fullName || ""}
            </Text>
            <View style={styles.profileMetaRow}>
              <MaterialIcons name="badge" size={14} color="#666" />
              <Text style={styles.profileMeta}>Mã: {userData?.id || ""}</Text>
            </View>
            <View style={styles.profileMetaRow}>
              <MaterialIcons name="work-outline" size={14} color="#666" />
              <Text style={styles.profileMeta}>Nhân viên</Text>
            </View>
          </View>
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
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
    position: "relative",
    height: 90,
  },
  profileGradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  floatingEditButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(173, 207, 238, 0.25)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(125, 171, 230, 1)",
    zIndex: 10,
  },
  floatingEditActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 6,
    zIndex: 10,
  },
  floatingCancelButton: {
    backgroundColor: "rgba(234, 234, 234, 0.38)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgb(102, 105, 108)",
  },
  floatingSaveButton: {
    backgroundColor: "#10B981",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    zIndex: 5,
  },
  avatarWrapper: {
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  profileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileMeta: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
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
  avatarEditOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
});
