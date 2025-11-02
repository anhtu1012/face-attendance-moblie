import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
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

import { setToken } from "@/api/axios";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { loginUser } from "@/api/auth";
import { LoginResponse } from "@/models/auth/login";
import { setAuthData } from "@/lib/features/loginSlice";
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
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleIsLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token);
        const userData = await AsyncStorage.getItem("userData");
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
    const onKeyboardShow = (event: any) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleEyePress = () => {
    setPasswordVisible((oldValue) => !oldValue);
    onEyePress?.();
  };

  const handleLogin = async () => {
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
      router.replace("/(drawer)" as any);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: `Đăng nhập thất bại: ${
          error.response?.data?.message || error.message
        }`,
        text1Style: { textAlign: "center", fontSize: 16 },
        topOffset: insets.top + 10,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#3674B5", /*"#2196F3"*/ "#3674B5"]}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.contentContainer}>
                {/* Logo and Header */}
                <View style={styles.headerContainer}>
                  <Image
                    source={require("@/assets/images/Psychologist.png")}
                    style={styles.logo}
                  />
                  <Text style={styles.appTitle}>AttendEase</Text>
                  <Text style={styles.appSubtitle}>Employee Portal</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                  <View style={styles.formCard}>
                    <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
                    <Text style={styles.loginPrompt}>
                      Đăng nhập để tiếp tục
                    </Text>

                    <View style={styles.inputContainer}>
                      <View style={styles.iconContainer}>
                        <Feather name="user" size={20} color="#3674B5" />
                      </View>
                      <TextInput
                        onChangeText={setUserName}
                        value={userName}
                        placeholder="Tên đăng nhập"
                        placeholderTextColor="#999"
                        style={styles.input}
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.iconContainer}>
                        <Feather name="lock" size={20} color="#3674B5" />
                      </View>
                      <TextInput
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#999"
                        style={styles.input}
                        secureTextEntry={!isPasswordVisible}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={handleEyePress}
                      >
                        <Feather
                          name={isPasswordVisible ? "eye" : "eye-off"}
                          size={20}
                          color="#3674B5"
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.optionsRow}>
                      <TouchableOpacity
                        style={styles.rememberContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            rememberMe && styles.checkboxActive,
                          ]}
                        >
                          {rememberMe && (
                            <Feather name="check" size={12} color="#fff" />
                          )}
                        </View>
                        <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.loginButton}
                      onPress={handleLogin}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["#3674B5" /*"#2196F3"*/, "#3674B5"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                      >
                        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    minHeight: height,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formCard: {
    width: "100%",
    maxWidth: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3674B5",
    marginBottom: 8,
  },
  loginPrompt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 16,
    height: 56,
  },
  iconContainer: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3674B5",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#3674B5",
  },
  rememberText: {
    fontSize: 14,
    color: "#666",
  },
  forgotText: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  registerText: {
    color: "#3674B5",
    fontWeight: "500",
  },
});

export default LoginScreen;
