import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ErrorAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  retryText?: string;
  closeText?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  onRetry,
  showRetry = false,
  retryText = "Thử lại",
  closeText = "Đóng",
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate modal entrance
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Shake animation for error icon
      Animated.sequence([
        Animated.delay(200),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      shakeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Error Icon with Animation */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <View style={styles.iconCircle}>
              <View style={styles.iconCircleInner}>
                <MaterialCommunityIcons
                  name="close-thick"
                  size={40}
                  color="#FFFFFF"
                />
              </View>
            </View>
            {/* Warning Glow */}
            <View style={styles.glow1} />
            <View style={styles.glow2} />
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Error Badge */}
          <View style={styles.badge}>
            <Feather name="alert-circle" size={12} color="#EF4444" />
            <Text style={styles.badgeText}>Lỗi</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showRetry && onRetry && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.retryButtonText}>{retryText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.closeButton, !showRetry && styles.closeButtonFull]}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>{closeText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    minWidth: 300,
    maxWidth: 400,
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FECACA",
  },
  iconCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  glow1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EF4444",
    opacity: 0.15,
  },
  glow2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EF4444",
    opacity: 0.08,
  },
  content: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  retryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  closeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  closeButtonFull: {
    flex: 1,
  },
  closeButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default ErrorAlert;
