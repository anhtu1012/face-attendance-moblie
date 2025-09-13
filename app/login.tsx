import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../lib/features/loginSlice";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = useCallback(async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save login status
      await AsyncStorage.setItem("isLoggedIn", "true");
      const userData = {
        username,
        firstName: new Date().toISOString(),
      };
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // Save user to Redux
      dispatch(setUser(userData));

      // Navigate to main app
      router.replace("/(drawer)" as any);
    } catch (error: any) {
      Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <AntDesign name="user" size={80} color="#fff" />
            <Text style={styles.title}>HỆ THỐNG CHẤM CÔNG</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <AntDesign name="user" size={20} color="#3674B5" />
              <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <AntDesign name="lock" size={20} color="#3674B5" />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <AntDesign
                  name={showPassword ? "eye" : ("eye" as any)}
                  size={20}
                  color="#3674B5"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ["#ccc", "#999"] : ["#3674B5", "#2196F3"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 20,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
  eyeButton: {
    padding: 5,
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
