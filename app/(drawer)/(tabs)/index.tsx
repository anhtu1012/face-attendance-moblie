import TodayWidget from "@/components/Home/TodayWidget";
import { formCategory } from "@/constants/form";
import { useGetSubmittedForm } from "@/hooks/useGetSubmittedForm";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import useSocket from "@/hooks/useSocket";
import { setUser } from "@/lib/features/loginSlice";
import { RootState } from "@/lib/store";
import { SubmittedFormItem } from "@/models/form/dtoSubmittedForm";
import { cancelSubmittedForm, getSubmittedForm } from "@/services/form/api";
import {
  AntDesign,
  Entypo,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

function HomePage() {
  const dispatch = useDispatch();
  const userProfileLocal = useSelector(
    (state: RootState) => state.auth.userProfile,
  );
  const { refetchForms, refetchUserData, refetchCurrentTimekeeping } =
    useLocalSearchParams();
  const {
    userId,
    userProfile,
    refetch: handleRefetchUserData,
  } = useGetUserProfile({ enabled: false });
  const { submittedFormListData, refetch: handleRefetchSubmittedFormData } =
    useGetSubmittedForm({
      userId: userId || "",
      limit: 5,
      enabled: false,
    });
  const [submittedForms, setSubmittedForms] = useState<SubmittedFormItem[]>(
    submittedFormListData?.data || [],
  );
  const [refreshing, setRefreshing] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const navigation = useNavigation();
  const socket = useSocket();

  const handleGetSubmittedForm = async () => {
    try {
      if (!userId) return;
      const res = await getSubmittedForm(userId);
      setSubmittedForms(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // socket for forms data
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not available");
      return;
    }

    console.log(
      "🔌 Setting up socket listener for UPDATE_FORM_STATUS_NOTIFICATION",
    );

    const handleGetSocketData = (data: SubmittedFormItem) => {
      console.log("📨 Socket message received:", data);

      // update submittedForms
      setSubmittedForms((prev) => {
        return prev.map((form) => {
          if (form.id !== data.id) return form;
          return data;
        });
      });

      // update isRegisterFace when face register form gets accepted
      if (Number(data.formCategoryId) !== formCategory.FACE_REGISTER) return;
      if (data.status !== "ACCEPTED") return;
      dispatch(setUser({ ...userProfileLocal, isRegisterFace: true }));
    };

    // Add listener
    socket.on("UPDATE_FORM_STATUS_NOTIFICATION", handleGetSocketData);

    // Cleanup listener on unmount
    return () => {
      console.log("🧹 Cleaning up socket listener");
      socket.off("UPDATE_FORM_STATUS_NOTIFICATION", handleGetSocketData);
    };
  }, [socket]);

  useEffect(() => {
    handleRefetchSubmittedFormData();
    handleRefetchUserData();
  }, []);

  // Refetch form data
  useEffect(() => {
    if (refetchForms === "true") {
      handleRefetchSubmittedFormData();
      // Clear the param by navigating without it
      router.replace("/(drawer)/(tabs)");
    }
  }, [refetchForms]);

  // Refetch user data
  useEffect(() => {
    if (refetchUserData === "true") {
      handleRefetchUserData();
      // Clear the param by navigating without it
      router.replace("/(drawer)/(tabs)");
    }
  }, [refetchUserData]);

  // Update local state when data changes
  useEffect(() => {
    if (submittedFormListData?.data) {
      setSubmittedForms(submittedFormListData.data);
    }
  }, [submittedFormListData]);

  // Update Redux store when userProfile changes
  useEffect(() => {
    if (userProfile) {
      dispatch(setUser(userProfile));
    }
  }, [userProfile, dispatch]);

  const handleOpenCancelModal = (formId: string) => {
    setSelectedFormId(formId);
    setCancelReason("");
    setCancelModalVisible(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModalVisible(false);
    setSelectedFormId(null);
    setCancelReason("");
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn");
      return;
    }

    setIsSubmittingCancel(true);
    try {
      console.log("Canceling form:", selectedFormId, "Reason:", cancelReason);

      // Simulate API call
      const reqBody = {
        reason: cancelReason,
        modifiedDate: new Date().toISOString(),
      };
      await cancelSubmittedForm(selectedFormId!, reqBody);

      // Refresh form list
      await handleGetSubmittedForm();

      handleCloseCancelModal();
      alert("Đã hủy đơn thành công");
    } catch (error) {
      console.error("Error canceling form:", error);
      alert("Có lỗi xảy ra khi hủy đơn");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      handleRefetchUserData(),
      handleRefetchSubmittedFormData(),
    ]).then((_) => setRefreshing(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => router.push("/(drawer)/(tabs)/profile")}
        >
          <Image
            source={
              userProfileLocal?.faceImg
                ? {
                    uri: userProfileLocal?.faceImg,
                  }
                : require("@/assets/images/empty-avatar.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Register face widget */}
        {!userProfileLocal?.isRegisterFace ? (
          <View style={styles.widgetContainer}>
            <View style={styles.faceRegisterHeader}>
              <View style={styles.faceIconContainer}>
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={32}
                  color="#3674B5"
                />
              </View>
              <View style={styles.faceRegisterContent}>
                <Text style={styles.faceRegisterTitle}>Đăng ký khuôn mặt</Text>
                <Text style={styles.faceRegisterSubtitle}>
                  Vui lòng thiết lập nhận diện khuôn mặt để có thể chấm công!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.faceRegisterButton}
              onPress={() => router.replace("/(drawer)/(face)/face-register")}
            >
              <Text style={styles.faceRegisterButtonText}>Đăng ký ngay</Text>
              <AntDesign name="account-book" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        {/* Today Widget */}
        {userProfileLocal?.isRegisterFace ? (
          <TodayWidget
            loadingSchedule={false}
            refetchCurrentTimekeeping={refetchCurrentTimekeeping as string}
            isRefresh={refreshing}
          />
        ) : (
          <></>
        )}

        {/* Form section - New Design */}
        <View style={styles.formSectionContainer}>
          {/* Simple Header */}
          <View style={styles.formSimpleHeader}>
            <Text style={styles.formSimpleTitle}>Tính trạng đơn từ</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(drawer)/(tabs)/(form)/view-all-submitted-form",
                  params: {
                    submittedForms: JSON.stringify(submittedForms),
                  },
                })
              }
            >
              <Text style={styles.viewAllLinkText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Form Cards */}
          {submittedForms.length > 0 ? (
            <View style={styles.formCardsContainer}>
              {submittedForms.slice(0, 3).map((form, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.formCard,
                    {
                      borderLeftColor:
                        form.status === "PENDING"
                          ? "#FF9800"
                          : form.status === "ACCEPTED"
                            ? "#4CAF50"
                            : form.status === "INACTIVE"
                              ? "#c3c3c3"
                              : "#F44336",
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/(drawer)/(tabs)/(form)/form-detail",
                      params: { ...form },
                    })
                  }
                  activeOpacity={0.7}
                >
                  {/* Card Header with Title and Status */}
                  <View style={styles.formCardHeader}>
                    <Text style={styles.formCardTitle} numberOfLines={1}>
                      {form.formCategoryTitle}
                    </Text>
                    <View
                      style={[
                        styles.formStatusPill,
                        {
                          backgroundColor:
                            form.status === "PENDING"
                              ? "#FF9800"
                              : form.status === "ACCEPTED"
                                ? "#4CAF50"
                                : form.status === "INACTIVE"
                                  ? "#c3c3c3"
                                  : "#F44336",
                        },
                      ]}
                    >
                      <Text style={styles.formStatusText}>
                        {form.status === "PENDING"
                          ? "Chờ duyệt"
                          : form.status === "ACCEPTED"
                            ? "Đã duyệt"
                            : form.status === "INACTIVE"
                              ? "Đã hủy"
                              : "Từ chối"}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.formCardMenu}>
                      <Entypo
                        name="dots-three-vertical"
                        size={16}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Reason */}
                  <Text style={styles.formCardReason} numberOfLines={1}>
                    {form.reason || "Không có lý do"}
                  </Text>

                  {/* Date and Approver Info */}
                  <View style={styles.formCardInfo}>
                    <View style={styles.formInfoRow}>
                      <AntDesign
                        name="calendar"
                        size={14}
                        color="#666"
                        style={styles.formInfoIcon}
                      />
                      <Text style={styles.formInfoText}>
                        Ngày tạo:{" "}
                        {new Date(form.createdAt ?? "").toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </Text>
                    </View>
                    <View style={styles.formInfoRow}>
                      <AntDesign
                        name="user"
                        size={14}
                        color="#666"
                        style={styles.formInfoIcon}
                      />
                      <Text style={styles.formInfoText} numberOfLines={1}>
                        Người duyệt: {form.approvedName || "Chưa có thông tin"}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.formCardActions}>
                    <TouchableOpacity
                      style={styles.formActionButton}
                      onPress={() =>
                        router.push({
                          pathname: "/(drawer)/(tabs)/(form)/form-detail",
                          params: { ...form },
                        })
                      }
                    >
                      <Text style={styles.formActionButtonText}>Chi tiết</Text>
                    </TouchableOpacity>
                    {form.status === "PENDING" && (
                      <TouchableOpacity
                        style={[
                          styles.formActionButton,
                          styles.formActionButtonDanger,
                        ]}
                        onPress={() => handleOpenCancelModal(form.id)}
                      >
                        <Text
                          style={[
                            styles.formActionButtonText,
                            styles.formActionButtonDangerText,
                          ]}
                        >
                          Hủy đơn
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconContainer}>
                <Octicons name="inbox" size={48} color="#ccc" />
              </View>
              <Text style={styles.emptyStateTitle}>Chưa có đơn nào</Text>
              <Text style={styles.emptyStateSubtitle}>
                Các đơn bạn nộp sẽ hiển thị ở đây
              </Text>
            </View>
          )}
        </View>

        {/* Bottom space */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Cancel Form Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseCancelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header with Gradient */}
            <LinearGradient
              colors={["#FF5252", "#F44336"]}
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalIconContainer}>
                  <MaterialCommunityIcons
                    name="cancel"
                    size={28}
                    color="#fff"
                  />
                </View>
                <View style={styles.modalHeaderTextContainer}>
                  <Text style={styles.modalTitle}>Hủy đơn</Text>
                  <Text style={styles.modalSubtitle}>
                    Vui lòng nhập lý do hủy
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleCloseCancelModal}
                style={styles.modalCloseButton}
              >
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons
                    name="text-box-outline"
                    size={20}
                    color="#666"
                  />
                  <Text style={styles.inputLabel}>
                    Lý do hủy <Text style={styles.required}>*</Text>
                  </Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Nhập lý do hủy đơn của bạn..."
                  placeholderTextColor="#999"
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!isSubmittingCancel}
                />
                <Text style={styles.inputHint}>
                  Lý do hủy sẽ được ghi nhận trong hệ thống
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleCloseCancelModal}
                  disabled={isSubmittingCancel}
                >
                  <Text style={styles.modalCancelButtonText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalSubmitButton,
                    isSubmittingCancel && styles.modalSubmitButtonDisabled,
                  ]}
                  onPress={handleSubmitCancel}
                  disabled={isSubmittingCancel}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isSubmittingCancel
                        ? ["#ccc", "#999"]
                        : ["#FF5252", "#F44336"]
                    }
                    style={styles.modalSubmitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isSubmittingCancel ? (
                      <>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.modalSubmitButtonText}>
                          Đang xử lý...
                        </Text>
                      </>
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.modalSubmitButtonText}>
                          Xác nhận hủy
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 14,
    color: "#666",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  widgetContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  summaryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3674B5",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    color: "#3674B5",
    fontSize: 14,
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  quoteIconContainer: {
    marginRight: 8,
  },
  quoteContainer: {
    position: "relative",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3674B5",
    marginBottom: 16,
  },
  quoteOpenIcon: {
    position: "absolute",
    top: -8,
    left: 8,
    opacity: 0.3,
  },
  quoteCloseIcon: {
    position: "absolute",
    bottom: -8,
    right: 8,
    opacity: 0.3,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    fontWeight: "500",
    marginTop: 8,
  },
  quoteDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quoteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  quoteDotActive: {
    backgroundColor: "#3674B5",
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  eventsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  eventIconContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  eventTime: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  eventDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  quickActionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  quickActionItem: {
    width: "25%",
    alignItems: "center",
    marginVertical: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#333",
  },
  bottomSpace: {
    height: 80, // Space for bottom navigation
  },
  faceRegisterHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  faceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF4F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  faceRegisterContent: {
    flex: 1,
  },
  faceRegisterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  faceRegisterSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  faceRegisterButton: {
    backgroundColor: "#3674B5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  faceRegisterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  noSubmittedFormText: {
    fontStyle: "italic",
  },
  // Modern Form Section Styles
  formHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  formHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  formIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#3674B5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  formSectionSubtitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  viewAllButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F0F7FF",
    borderRadius: 20,
    gap: 4,
  },
  viewAllTextModern: {
    color: "#3674B5",
    fontSize: 13,
    fontWeight: "600",
  },
  formListContainer: {
    marginTop: 4,
  },
  modernFormItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  formItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  formItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  modernFormIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  formItemContent: {
    flex: 1,
    justifyContent: "center",
  },
  modernFormTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  formDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modernFormDate: {
    fontSize: 13,
    color: "#999",
  },
  formItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modernStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    gap: 4,
  },
  statusDotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modernStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  formArrow: {
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  // New Design Form Section Styles
  formSectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formSimpleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formSimpleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  viewAllLinkText: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "500",
  },
  formCardsContainer: {
    gap: 12,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  formCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginRight: 8,
  },
  formStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  formStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  formCardMenu: {
    padding: 4,
  },
  formCardReason: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  formCardInfo: {
    marginBottom: 12,
  },
  formInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  formInfoIcon: {
    marginRight: 6,
  },
  formInfoText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  formCardActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  formActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3674B5",
    alignItems: "center",
    justifyContent: "center",
  },
  formActionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3674B5",
  },
  formActionButtonDanger: {
    borderColor: "#F44336",
  },
  formActionButtonDangerText: {
    color: "#F44336",
  },
  // Cancel Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalHeaderTextContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  required: {
    color: "#FF5252",
  },
  textArea: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    fontSize: 15,
    color: "#333",
    minHeight: 120,
    textAlignVertical: "top",
  },
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    fontStyle: "italic",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  modalSubmitButton: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#FF5252",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalSubmitButtonDisabled: {
    opacity: 0.6,
  },
  modalSubmitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  modalSubmitButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HomePage;
