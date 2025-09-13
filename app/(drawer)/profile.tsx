import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  // Image,
  Alert,
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
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    employeeId: "NV001",
    department: "Phòng IT",
    position: "Lập trình viên",
    phone: "0123456789",
    email: "nguyenvana@company.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    joinDate: "01/01/2023",
  });

  const handleSave = () => {
    Alert.alert("Thành công", "Thông tin đã được cập nhật!");
    setIsEditing(false);
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

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <MaterialIcons name="person" size={60} color="#3674B5" />
          </View>
          <TouchableOpacity style={styles.editImageButton}>
            <AntDesign name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userPosition}>{userData.position}</Text>
        <Text style={styles.userDepartment}>{userData.department}</Text>
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
                <Text style={styles.statValue}>{stat.value}</Text>
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
              <Text style={styles.infoValue}>{userData.employeeId}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.name}
                  onChangeText={(text) =>
                    setUserData({ ...userData, name: text })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>{userData.name}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chức vụ:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.position}
                  onChangeText={(text) =>
                    setUserData({ ...userData, position: text })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>{userData.position}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phòng ban:</Text>
              <Text style={styles.infoValue}>{userData.department}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.phone}
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
              <Text style={styles.infoLabel}>Ngày vào làm:</Text>
              <Text style={styles.infoValue}>{userData.joinDate}</Text>
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
