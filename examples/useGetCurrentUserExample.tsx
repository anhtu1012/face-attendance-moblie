import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Ví dụ 1: Hiển thị thông tin user cơ bản
export const UserInfoExample = () => {
  const { user, isLoggedIn, userId } = useGetCurrentUser();

  if (!isLoggedIn) {
    return <Text>Vui lòng đăng nhập</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin người dùng</Text>
      <Text>ID: {userId}</Text>
      <Text>Tên: {user?.fullName}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Phone: {user?.phone}</Text>
    </View>
  );
};

// Ví dụ 2: Navigation dựa trên trạng thái đăng nhập
export const NavigationExample = () => {
  const { isLoggedIn, user } = useGetCurrentUser();

  if (!isLoggedIn) {
    return <Text>Chuyển đến trang đăng nhập</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Chào mừng {user?.fullName}!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Vào ứng dụng</Text>
      </TouchableOpacity>
    </View>
  );
};

// Ví dụ 3: Conditional rendering dựa trên role
export const RoleBasedExample = () => {
  const { user, isLoggedIn } = useGetCurrentUser();

  if (!isLoggedIn) {
    return <Text>Vui lòng đăng nhập</Text>;
  }

  const isAdmin = user?.roleId === "1"; // Giả sử roleId "1" là admin

  return (
    <View style={styles.container}>
      <Text>Xin chào {user?.fullName}</Text>
      {isAdmin && (
        <TouchableOpacity style={styles.adminButton}>
          <Text style={styles.buttonText}>Quản trị</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hồ sơ cá nhân</Text>
      </TouchableOpacity>
    </View>
  );
};

// Ví dụ 4: Sử dụng trong API calls
export const ApiCallExample = () => {
  const { userId, isLoggedIn } = useGetCurrentUser();

  const handleUpdateProfile = async () => {
    if (!isLoggedIn || !userId) {
      alert("Vui lòng đăng nhập");
      return;
    }

    try {
      // Gọi API với userId từ Redux store
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        // ... other options
      });
      // Handle response
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Cập nhật hồ sơ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3674B5",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  adminButton: {
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
