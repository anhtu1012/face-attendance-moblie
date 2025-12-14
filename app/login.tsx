import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
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

import { loginUser } from "@/api/auth";
import { setToken } from "@/api/axios";
import { CustomClock } from "@/components/Login/CustomClock";
import { setAuthData } from "@/lib/features/loginSlice";
import { LoginResponse } from "@/models/auth/login";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const { width, height } = Dimensions.get("window");

export interface ILoginScreenProps {
  onEyePress?: () => void;
}

// Token validation utility
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const LoginScreen: React.FC<ILoginScreenProps> = ({ onEyePress }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const keyboardOffset = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handleIsLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token);
        const userData = await AsyncStorage.getItem("userData");

        if (!token || !userData) return;

        if (token && userData) {
          // Check if token is still valid
          if (isTokenValid(token)) {
            // Token is valid, auto login
            router.replace("/(drawer)" as any);
          } else {
            // Token expired, clear storage
            await AsyncStorage.multiRemove(["token", "userData"]);
            setToken(null);
            Toast.show({
              type: "info",
              text1: "Phiên đăng nhập đã hết hạn",
              text1Style: { textAlign: "center", fontSize: 16 },
              topOffset: insets.top + 10,
            });
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error); // Ensure error is logged
        await AsyncStorage.multiRemove(["token", "userData"]);
        setToken(null);
      }
    };
    handleIsLogin();
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardOffset, {
          duration: event.duration || 250,
          toValue: -event.endCoordinates.height * 0.3,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event) => {
        Animated.timing(keyboardOffset, {
          duration: event.duration || 250,
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleForgotPassword = async () => {
    // Validate new password
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

    // Validate confirm password
    if (!confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng xác nhận mật khẩu",
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

    setIsResetLoading(true);
    try {
      // TODO: Replace with your actual reset password API call
      // await resetPasswordAPI(userName, newPassword);

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      Toast.show({
        type: "success",
        text1: "Đặt lại mật khẩu thành công",
        text2: "Vui lòng đăng nhập với mật khẩu mới",
        text1Style: { textAlign: "center", fontSize: 16 },
        text2Style: { textAlign: "center", fontSize: 14 },
        topOffset: insets.top + 10,
      });

      setShowForgotPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Không thể đặt lại mật khẩu",
        text2: error?.message || "Vui lòng thử lại sau",
        text1Style: { textAlign: "center", fontSize: 16 },
        text2Style: { textAlign: "center", fontSize: 14 },
        topOffset: insets.top + 10,
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập đầy đủ thông tin",
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Logging in with:", { userName, password });
      const response = await loginUser({ username: userName, password });
      const loginResponse: LoginResponse = response.data;
      setToken(loginResponse.accessToken);
      await AsyncStorage.setItem("token", loginResponse.accessToken);
      await AsyncStorage.setItem(
        "userProfile",
        JSON.stringify(loginResponse.userProfile),
      );
      dispatch(setAuthData(loginResponse));

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công!",
        text2: "Chào mừng bạn trở lại",
        topOffset: insets.top + 10,
      });

      setTimeout(() => {
        router.replace("/(drawer)" as any);
      }, 500);
    } catch (error: any) {
      if (error.status) {
        Toast.show({
          type: "error",
          text1: "Sai thông tin đăng nhập",
          text2: "Vui lòng kiểm tra lại tên đăng nhập và mật khẩu",
          topOffset: insets.top + 10,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Đăng nhập thất bại",
          text2: error.response?.data?.message || error.message,
          topOffset: insets.top + 10,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#5B7FD8", "#3674B5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[
                styles.contentContainer,
                { transform: [{ translateY: keyboardOffset }] },
              ]}
            >
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                  <CustomClock />
                </View>

                {/* White Card Container */}
                <View style={styles.cardContainer}>
                  {!showForgotPasswordModal ? (
                    <>
                      {/* Login Form */}
                      {/* Username Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên đăng nhập</Text>
                        <View style={styles.inputWrapper}>
                          <TextInput
                            value={userName}
                            onChangeText={setUserName}
                            placeholder="Nhập tên đăng nhập"
                            placeholderTextColor="#B0B0B0"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </View>
                      </View>

                      {/* Password Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <View style={styles.inputWrapper}>
                          <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#B0B0B0"
                            secureTextEntry={!isPasswordVisible}
                            style={styles.input}
                            autoCapitalize="none"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setIsPasswordVisible(!isPasswordVisible)
                            }
                            style={styles.eyeIcon}
                          >
                            <Feather
                              name={isPasswordVisible ? "eye" : "eye-off"}
                              size={20}
                              color="#666"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Forgot Password Link */}
                      <TouchableOpacity
                        style={styles.forgotPasswordLink}
                        onPress={() => setShowForgotPasswordModal(true)}
                      >
                        <Text style={styles.forgotPasswordText}>
                          Quên mật khẩu?
                        </Text>
                      </TouchableOpacity>

                      {/* Login Button */}
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        )}
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* Reset Password Form */}
                      <View style={styles.resetHeader}>
                        <TouchableOpacity
                          onPress={() => {
                            setShowForgotPasswordModal(false);
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          style={styles.backButton}
                        >
                          <Feather
                            name="arrow-left"
                            size={24}
                            color="#3674B5"
                          />
                        </TouchableOpacity>
                        <Text style={styles.resetTitle}>Đặt lại mật khẩu</Text>
                      </View>

                      <Text style={styles.resetDescription}>
                        Nhập mật khẩu mới cho tài khoản{" "}
                        <Text style={styles.resetUsername}>{userName}</Text>
                      </Text>

                      {/* New Password Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu mới</Text>
                        <View style={styles.inputWrapper}>
                          <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Nhập mật khẩu mới"
                            placeholderTextColor="#B0B0B0"
                            secureTextEntry={!showNewPassword}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
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
                      </View>

                      {/* Confirm Password Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Xác nhận mật khẩu</Text>
                        <View style={styles.inputWrapper}>
                          <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Nhập lại mật khẩu mới"
                            placeholderTextColor="#B0B0B0"
                            secureTextEntry={!showConfirmPassword}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
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

                      {/* Reset Password Button */}
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleForgotPassword}
                        activeOpacity={0.8}
                        disabled={isResetLoading}
                      >
                        {isResetLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.loginButtonText}>
                            Đặt lại mật khẩu
                          </Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: height * 0.85,
  },
  // Illustration styles
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 40, // Overlap with card
    zIndex: 1,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  illustration: {
    width: "200%",
    height: "200%",
  },
  // Card styles
  cardContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 40,
    paddingBottom: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // Input styles
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  // Forgot password link
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#3674B5",
    fontSize: 14,
    fontWeight: "600",
  },
  // Reset password view styles
  resetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  resetTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3674B5",
  },
  resetDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  resetUsername: {
    fontWeight: "600",
    color: "#3674B5",
  },
  // Button styles
  loginButton: {
    backgroundColor: "#3674B5",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  // Divider styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#999",
  },
  // Social login styles
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialIcon: {
    width: 28,
    height: 28,
  },
  // Register link styles
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerPrompt: {
    fontSize: 14,
    color: "#666",
  },
  registerText: {
    color: "#3674B5",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LoginScreen;
