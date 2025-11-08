import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { updateUserPassword } from "@/services/user/api";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { userId } = useGetUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleResetPassword = async () => {
    // Validate inputs
    if (!currentPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập mật khẩu hiện tại",
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
      return;
    }

    if (!newPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập mật khẩu mới",
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu phải có ít nhất 6 ký tự",
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
      return;
    }

    // Check if new password is same as current
    if (newPassword === currentPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
      return;
    }

    if (!confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng xác nhận mật khẩu mới",
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu không khớp",
        text2: "Vui lòng nhập lại mật khẩu xác nhận",
        text1Style: { textAlign: "center", fontSize: 16 },
        text2Style: { textAlign: "center", fontSize: 14 },
        topOffset: insets.top + 10,
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with your actual change password API call
      // const userData = await AsyncStorage.getItem("userData");
      await updateUserPassword(userId!, currentPassword, newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Toast.show({
        type: "success",
        text1: "Đổi mật khẩu thành công",
        text2: "Mật khẩu của bạn đã được cập nhật",
        text1Style: { textAlign: "center", fontSize: 16 },
        text2Style: { textAlign: "center", fontSize: 14 },
        topOffset: insets.top + 10,
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      // Navigate back after success
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Không thể đổi mật khẩu",
        text2: error?.message || "Vui lòng kiểm tra lại mật khẩu hiện tại",
        text1Style: { textAlign: "center", fontSize: 16 },
        text2Style: { textAlign: "center", fontSize: 14 },
        topOffset: insets.top + 10,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Form */}
            <View style={styles.formContainer}>
              {/* Current Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu hiện tại</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu hiện tại"
                    placeholderTextColor="#999"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showCurrentPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu mới</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="key"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu mới"
                    placeholderTextColor="#999"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showNewPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.hint}>
                  Mật khẩu phải có ít nhất 6 ký tự
                </Text>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="check-circle"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Security Tips */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Mẹo bảo mật:</Text>
                <View style={styles.tipItem}>
                  <Feather name="check" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>
                    Sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Feather name="check" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>
                    Tránh sử dụng thông tin cá nhân dễ đoán
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Feather name="check" size={16} color="#4CAF50" />
                  <Text style={styles.tipText}>
                    Không chia sẻ mật khẩu với bất kỳ ai
                  </Text>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Cập nhật mật khẩu</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3674B5",
  },
  // Description styles
  descriptionContainer: {
    backgroundColor: "#F0F7FF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 32,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  // Form styles
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    marginLeft: 4,
  },
  // Tips styles
  tipsContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  // Button styles
  submitButton: {
    backgroundColor: "#3674B5",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
