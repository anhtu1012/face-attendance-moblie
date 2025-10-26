import TodayWidget from "@/components/Home/TodayWidget";
import { motivationalQuotes } from "@/constants/homepage";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { WorkingSchedule } from "@/model/schedule/dtoWorkingSchedule";
import { getSubmittedForm } from "@/services/form/api";
import {
  AntDesign,
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { DrawerActions, useIsFocused } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface FormDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  response: string;
  formCategoryId: string;
  formCategoryTitle: string;
  submittedBy: string;
  submittedName: string;
  approvedBy: string;
  approvedName: string;
  startTime: string;
  endTime: string;
  approvedTime: string;
  file: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const fakeSchedule: WorkingSchedule = {
  id: "1",
  createdAt: "2025-09-14T08:00:00Z",
  updatedAt: "2025-09-14T08:00:00Z",
  timeKeepingId: "TK123",
  code: "WS001",
  userCode: "U001",
  userContractCode: "UC001",
  status: "active",
  date: "2025-09-14",
  fullName: "Nguyen Van A",
  shiftCode: "S1",
  shiftName: "Ca sáng",
  branchName: "Văn phòng Hà Nội",
  branchCode: "HN01",
  addressLine: "123 Đường ABC, Hà Nội",
  startShiftTime: "08:00",
  endShiftTime: "17:00",
  workingHours: 8,
  checkInTime: "08:05",
  checkOutTime: "17:00",
  statusTimeKeeping: "Đã chấm công",
  positionName: "Nhân viên",
  managerFullName: "Tran Thi B",
};
function HomePage() {
  const { userProfile, isLoading, error, refetch, userId } =
    useGetUserProfile();
  const [submittedForms, setSubmittedForms] = useState<FormDetail[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    handleGetSubmittedForm();
  }, [isFocused, userProfile]);

  const handleGetSubmittedForm = async () => {
    try {
      if (!userProfile) return;
      const res = await getSubmittedForm(userProfile?.id);
      setSubmittedForms(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRenderFormState = (form: FormDetail) => {
    if (form.status == "PENDING") {
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
    } else if (form.status == "REJECTED")
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

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(
        (prevIndex) => (prevIndex + 1) % motivationalQuotes.length,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
              userProfile?.faceImg
                ? {
                    uri: userProfile?.faceImg,
                  }
                : require("@/assets/images/empty-avatar.png")
            }
            style={styles.avatar}
          />
          <View style={styles.statusDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }
      >
        {/* Register face widget */}
        {!userProfile?.faceImg && (
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
        )}

        {/* Motivational Quote Widget 
        <View style={styles.widgetContainer}>
          <View style={styles.quoteHeader}>
            <View style={styles.quoteIconContainer}>
              <MaterialCommunityIcons
                name="lightbulb"
                size={24}
                color="#3674B5"
              />
            </View>
            <Text style={styles.sectionTitle}>Động lực hôm nay</Text>
          </View>

          <View style={styles.quoteContainer}>
            <MaterialCommunityIcons
              name="format-quote-open"
              size={32}
              color="#3674B5"
              style={styles.quoteOpenIcon}
            />
            <Text style={styles.quoteText}>
              {motivationalQuotes[currentQuoteIndex].text}
            </Text>
            <Text style={styles.quoteAuthor}>
              - {motivationalQuotes[currentQuoteIndex].author}
            </Text>
            <MaterialCommunityIcons
              name="format-quote-close"
              size={32}
              color="#3674B5"
              style={styles.quoteCloseIcon}
            />
          </View>

          <View style={styles.quoteDots}>
            {motivationalQuotes.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quoteDot,
                  index === currentQuoteIndex && styles.quoteDotActive,
                ]}
                onPress={() => setCurrentQuoteIndex(index)}
              />
            ))}
          </View>
        </View>*/}

        {/* Today Widget 
        <TodayWidget todaySchedule={fakeSchedule} loadingSchedule={false} />*/}

        {/* Forms Status */}
        {/* <FormsStatusWidget
          forms={forms}
          loading={loading}
          formatDate={formatDate}
          onFormUpdate={fetchForms}
        /> */}

        {/* Form section*/}
        <View style={styles.widgetContainer}>
          <View style={styles.quoteHeader}>
            <View style={styles.quoteIconContainer}>
              <AntDesign name="form" size={24} color="#3674B5" />
            </View>
            <Text style={styles.sectionTitle}>Đơn đã nộp</Text>
            <TouchableOpacity
              style={[styles.viewAllButton, { marginLeft: "auto" }]}
              onPress={() =>
                router.push({
                  pathname: "/(drawer)/(tabs)/(form)/view-all-submitted-form",
                  params: {
                    submittedForms: JSON.stringify(submittedForms),
                  },
                })
              }
            >
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {submittedForms.length > 0 ? (
            submittedForms.map((form, index) => (
              <TouchableOpacity
                key={index}
                style={styles.eventItem}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/(form)/form-detail",
                    params: { ...form },
                  })
                }
              >
                <View style={styles.eventIconContainer}>
                  <Octicons
                    name="paperclip"
                    size={24}
                    color="#3674B5"
                    style={{ marginVertical: "auto" }}
                  />
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>
                    {form.formCategoryTitle}
                  </Text>
                  <Text style={styles.eventTime}>
                    {new Date(form.createdAt).toDateString()}
                  </Text>
                </View>
                {handleRenderFormState(form)}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSubmittedFormText}>
              Không có đơn để hiển thị
            </Text>
          )}
        </View>
        {/* Quick Actions 
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionItem}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#E3F2FD" }]}
              >
                <AntDesign name="calendar" size={24} color="#2196F3" />
              </View>
              <Text style={styles.quickActionText}>Bảng công</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#E8F5E9" }]}
              >
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={24}
                  color="#4CAF50"
                />
              </View>
              <Text style={styles.quickActionText}>Lương</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#FFF3E0" }]}
              >
                <AntDesign name="form" size={24} color="#FF9800" />
              </View>
              <Text style={styles.quickActionText}>Tạo đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#FCE4EC" }]}
              >
                <AntDesign name="user" size={24} color="#E91E63" />
              </View>
              <Text style={styles.quickActionText}>Cá nhân</Text>
            </TouchableOpacity>
          </View>
        </View>*/}

        {/* Bottom space */}
        <View style={styles.bottomSpace} />
      </ScrollView>
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
});

export default HomePage;
