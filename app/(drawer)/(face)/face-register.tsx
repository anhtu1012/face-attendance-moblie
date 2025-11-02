import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./face-register.styles";

export default function FaceRegisterPage() {
  const insets = useSafeAreaInsets();
  const [registrationStep, setRegistrationStep] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBiometricSuccess, setIsBiometricSuccess] = useState(false);

  const steps = [
    {
      title: "Chuẩn bị",
      description: "Đảm bảo môi trường sáng và khuôn mặt rõ ràng",
      icon: "info-circle",
    },
    {
      title: "Chụp ảnh",
      description: "Chụp khuôn mặt từ nhiều góc độ khác nhau",
      icon: "camera",
    },
    {
      title: "Xử lý",
      description: "Hệ thống đang xử lý và lưu trữ dữ liệu",
      icon: "loading",
    },
    {
      title: "Hoàn thành",
      description: "Đăng ký khuôn mặt thành công",
      icon: "check-circle",
    },
  ];

  const handleStartRegistration = () => {
    if (isRegistered) {
      Alert.alert(
        "Xác nhận",
        "Bạn đã đăng ký khuôn mặt. Bạn có muốn đăng ký lại?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng ký lại",
            onPress: () => {
              router.replace({
                pathname: "/(drawer)/(face)/camera",
              });
              // handleBiometricAuth();
            },
          },
        ],
      );
    } else {
      router.replace({
        pathname: "/(drawer)/(face)/camera",
      });
      // handleBiometricAuth();
    }
  };

  const startRegistration = () => {
    setRegistrationStep(1);
    // Simulate registration process
    setTimeout(() => setRegistrationStep(2), 2000);
    setTimeout(() => setRegistrationStep(3), 4000);
    setTimeout(() => {
      setRegistrationStep(0);
      setIsRegistered(true);
      Alert.alert("Thành công", "Đăng ký khuôn mặt thành công!");
    }, 6000);
  };

  const guidelines = [
    "Đảm bảo khuôn mặt được chiếu sáng đều",
    "Nhìn thẳng vào camera",
    "Không đeo kính râm hoặc khẩu trang",
    "Giữ khuôn mặt trong khung hình",
    "Không cử động trong quá trình chụp",
  ];

  return (
    <ScrollView style={[styles.container]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <MaterialIcons name="face-retouching-natural" size={60} color="#fff" />
        <Text style={styles.headerTitle}>Đăng ký khuôn mặt</Text>
        <Text style={styles.headerSubtitle}>
          Thiết lập nhận diện khuôn mặt cho chấm công
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={
              isRegistered ? ["#4CAF50", "#45a049"] : ["#FF9800", "#F57C00"]
            }
            style={styles.statusGradient}
          >
            <MaterialIcons
              name={isRegistered ? "verified-user" : "face"}
              size={40}
              color="#fff"
            />
            <Text style={styles.statusTitle}>
              {isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
            </Text>
            <Text style={styles.statusDescription}>
              {isRegistered
                ? "Khuôn mặt của bạn đã được đăng ký thành công"
                : "Bạn cần đăng ký khuôn mặt để sử dụng chấm công"}
            </Text>
          </LinearGradient>
        </View>

        {/* Registration Steps */}
        {registrationStep > 0 && (
          <View style={styles.stepsContainer}>
            <Text style={styles.sectionTitle}>Quá trình đăng ký</Text>

            {steps.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.stepCard,
                  registrationStep >= index + 1 && styles.activeStep,
                ]}
              >
                <View style={styles.stepIcon}>
                  <AntDesign
                    name={step.icon as any}
                    size={20}
                    color={registrationStep >= index + 1 ? "#4CAF50" : "#ccc"}
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      registrationStep >= index + 1 && styles.activeStepText,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.sectionTitle}>Hướng dẫn chụp ảnh</Text>

          {guidelines.map((guideline, index) => (
            <View key={index} style={styles.guidelineItem}>
              <AntDesign name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>{guideline}</Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleStartRegistration}
          disabled={registrationStep > 0}
        >
          <LinearGradient
            colors={
              registrationStep > 0
                ? ["#ccc", "#999"]
                : isRegistered
                  ? ["#FF9800", "#F57C00"]
                  : ["#4CAF50", "#45a049"]
            }
            style={styles.actionButtonGradient}
          >
            <MaterialIcons
              name={
                registrationStep > 0
                  ? "hourglass-empty"
                  : isRegistered
                    ? "refresh"
                    : "face-retouching-natural"
              }
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {registrationStep > 0
                ? "Đang xử lý..."
                : isRegistered
                  ? "Đăng ký lại"
                  : "Bắt đầu đăng ký"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Lưu ý bảo mật</Text>
          <Text style={styles.infoText}>
            • Dữ liệu khuôn mặt được mã hóa và bảo mật tuyệt đối
          </Text>
          <Text style={styles.infoText}>
            • Chỉ được sử dụng cho mục đích chấm công
          </Text>
          <Text style={styles.infoText}>
            • Bạn có thể yêu cầu xóa dữ liệu bất kỳ lúc nào
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
