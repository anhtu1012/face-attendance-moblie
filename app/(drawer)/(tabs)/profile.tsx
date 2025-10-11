
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { dtoUpdateUser } from "../../../models/auth/dtoUser";
import DependentInfo from "./profile/DependentInfo";
import GeneralInfo from "./profile/GeneralInfo";
import ResumeInfo from "./profile/ResumeInfo";
import WorkContractInfo from "./profile/WorkContractInfo";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const { userProfile, isLoading, error, refetch, userId } = useGetUserProfile();
  const updateUserMutation = useUpdateUser();
  const tabs = [
    { id: 0, title: "Thông tin chung" },
    { id: 1, title: "Sơ yếu lý lịch" },
    { id: 2, title: "Người phụ thuộc" },
    { id: 3, title: "Hợp đồng" },
  ];
  const handleUpdateUserData = (updatedData: dtoUpdateUser) => {
    updateUserMutation.mutate({
      userId: userId || "",
      onboardData: updatedData,
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <GeneralInfo
            userData={userProfile}
            onUpdateUserData={handleUpdateUserData}
          />
        );
      case 1:
        return (
          <ResumeInfo userData={userProfile} onUpdateUserData={handleUpdateUserData} />
        );
      case 2:
        return (
          <DependentInfo
            userData={userProfile}
            onUpdateUserData={handleUpdateUserData}
          />
        );
      case 3:
        return (
          <WorkContractInfo
            userData={userProfile}
            onUpdateUserData={handleUpdateUserData}
          />
        );
      default:
        return (
          <GeneralInfo
            userData={userProfile}
            onUpdateUserData={handleUpdateUserData}
          />
        );
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="arrow-left" size={24} color="#3674B5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin nhân sự</Text>
        </View>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              userProfile?.faceImg
                ? { uri: userProfile?.faceImg }
                : require("../../../assets/images/empty-avatar.png")
            }
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile?.fullName || "--"}</Text>
          <Text style={styles.profilePosition}>Nhân viên</Text>
          <Text style={styles.profileCode}>Mã: 12</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Đang làm việc</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
          decelerationRate="fast"
          snapToInterval={120}
          snapToAlignment="start"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab.id && styles.activeTabButtonText,
                ]}
              >
                {tab.title}
              </Text>
              {activeTab === tab.id && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}
      </ScrollView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  profileCard: {
    backgroundColor: "#f8f9fa",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#3674B5",
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  profileCode: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  statusContainer: {
    alignSelf: "flex-start",
  },
  statusBadge: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 4,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 40, // Extra space to indicate scrollable
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    position: "relative",
    minWidth: 100, // Ensure minimum width for better touch targets
  },
  activeTabButton: {
    // No background color for active state
  },
  tabButtonText: {
    fontSize: 14,
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
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: "#3674B5",
    borderRadius: 2,
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
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
});
