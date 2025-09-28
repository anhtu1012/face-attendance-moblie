import { getUserProfileFromStorage } from "@/utils/userProfileUtils";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  // Image,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    userName: "",
    roleName: "",
    fullName: "",
    email: "",
    faceImg: "",
    birthDay: "",
    gender: "",
    phone: "",
    address: "",
    isActive: false,
  });
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfileFromStorage();
        if (userProfile) {
          setUserData({
            id: userProfile.id || "",
            userName: userProfile.userName || "",
            roleName: userProfile.roleName || "",
            fullName: userProfile.fullName || "",
            email: userProfile.email || "",
            faceImg: userProfile.faceImg || "",
            birthDay: userProfile.birthDay || "",
            gender: userProfile.gender || "",
            phone: userProfile.phone || "",
            address: userProfile.address || "",
            isActive: userProfile.isActive || false,
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);
  const handleSave = () => {
    Alert.alert("Thành công", "Thông tin đã được cập nhật!");
    setIsEditing(false);
  };
  const formatDate = (dateString: any) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "Định dạng không hợp lệ";
    }
  };
  const formatGender = (gender: any) => {
    if (gender === "M") return "Nam";
    if (gender === "F") return "Nữ";
    return "Khác";
  };

  const profileStats = [
    {
      label: "Ngày làm việc",
      value: "245",
      icon: "calendar",
      color: "#4CAF50",
    },
    {
      label: "Đơn đã tạo",
      value: "12",
      icon: "file-text",
      color: "#2196F3",
    },
    {
      label: "Giờ overtime",
      value: "48",
      icon: "clock-circle",
      color: "#FF9800",
    },
  ];
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={[styles.container]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            {userData.faceImg ? (
              <Image source={{ uri: userData.faceImg }} />
            ) : (
              <MaterialIcons name="person" size={60} color="#3674B5" />
            )}
          </View>
          <TouchableOpacity style={styles.editImageButton}>
            <AntDesign name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{userData.fullName}</Text>
        <Text style={styles.userPosition}>{userData.roleName}</Text>
        <Text style={styles.userDepartment}>Mã: {userData.id}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <LinearGradient
                  colors={[stat.color, `${stat.color}CC`]}
                  style={styles.statIcon}
                >
                  <AntDesign name={stat.icon as any} size={20} color="#fff" />
                </LinearGradient>
                <Text
                  style={[
                    styles.statValue,
                    stat.label === "Trạng thái" && { fontSize: 14 },
                  ]}
                >
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.infoContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <AntDesign
                name={isEditing ? "close" : "edit"}
                size={20}
                color="#3674B5"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã nhân viên:</Text>
              <Text style={styles.infoValue}>{userData.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên đăng nhập:</Text>
              <Text style={styles.infoValue}>{userData.userName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.fullName}
                  onChangeText={(text) =>
                    setUserData({ ...userData, fullName: text })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>{userData.fullName}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chức vụ:</Text>
              <Text style={styles.infoValue}>{userData.roleName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới tính:</Text>
              <Text style={styles.infoValue}>
                {formatGender(userData.gender)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày sinh:</Text>
              <Text style={styles.infoValue}>
                {formatDate(userData.birthDay)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) =>
                    setUserData({ ...userData, phone: text })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>{userData.phone}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.email}
                  keyboardType="email-address"
                  onChangeText={(text) =>
                    setUserData({ ...userData, email: text })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>{userData.email}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, styles.multilineInput]}
                  value={userData.address}
                  onChangeText={(text) =>
                    setUserData({ ...userData, address: text })
                  }
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>{userData.address}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: userData.isActive ? "#4CAF50" : "#F44336" },
                ]}
              >
                {userData.isActive ? "Đang hoạt động" : "Đã khóa"}
              </Text>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={["#4CAF50", "#45a049"]}
                style={styles.saveButtonGradient}
              >
                <MaterialIcons name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 30,
    paddingBottom: 40,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userPosition: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 3,
  },
  userDepartment: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#3674B5",
    fontWeight: "500",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  editButton: {
    padding: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  infoInput: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: "#3674B5",
    paddingVertical: 2,
  },
  multilineInput: {
    textAlign: "left",
    minHeight: 40,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
