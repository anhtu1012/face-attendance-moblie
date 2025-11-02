import { useSendOTPContract } from "@/hooks/useSendOTPContract";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSignComplete: (signatureFile: string, otpCode: string) => void;
  contractNumber: string;
  userContractId: string;
  userGmail: string;
}

const { height } = Dimensions.get("window");

const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  onClose,
  onSignComplete,
  contractNumber,
  userContractId,
  userGmail,
}) => {
  const [step, setStep] = useState<"signature" | "otp">("signature");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [signatureBase64, setSignatureBase64] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const signatureRef = useRef<any>(null);
  const sendOTP = useSendOTPContract();
  const otpInputs = useRef<(TextInput | null)[]>([]);

  // Signature style configuration
  const signatureStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      margin: 0;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body, html {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  `;

  // Handle signature result
  const handleSignatureOK = (signature: string) => {
    setSignatureBase64(signature);
    sendOTP.mutate({
      userContractId: userContractId,
      userGmail: userGmail,
    });
    setStep("otp");
  };

  // Handle signature empty
  const handleSignatureEmpty = () => {
    Alert.alert("Lỗi", "Vui lòng ký tên trước khi tiếp tục");
  };

  // Clear signature
  const handleClearSignature = () => {
    signatureRef.current?.clearSignature();
  };

  // Confirm signature and move to OTP
  const handleConfirmSignature = () => {
    signatureRef.current?.readSignature();
  };

  // Handle OTP input
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Verify OTP and complete signing
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 chữ số OTP");
      return;
    }
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      onSignComplete(signatureBase64, otpCode);
      handleClose();
    }, 1500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    Alert.alert(
      "Thành công",
      "Mã OTP mới đã được gửi đến số điện thoại của bạn"
    );
    setOtp(["", "", "", "", "", ""]);
    otpInputs.current[0]?.focus();
  };

  // Back to signature from OTP
  const handleBackToSignature = () => {
    setStep("signature");
    setOtp(["", "", "", "", "", ""]);
  };

  // Close modal and reset
  const handleClose = () => {
    setStep("signature");
    setOtp(["", "", "", "", "", ""]);
    setSignatureBase64("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="file-sign"
                size={24}
                color="#3674B5"
              />
              <Text style={styles.headerTitle}>
                {step === "signature" ? "Ký hợp đồng" : "Xác thực OTP"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Contract Info */}
          <View style={styles.contractInfo}>
            <Text style={styles.contractLabel}>Hợp đồng</Text>
            <Text style={styles.contractNumberText}>{contractNumber}</Text>
          </View>

          {/* Signature Step */}
          {step === "signature" && (
            <View style={styles.signatureContainer}>
              <Text style={styles.signatureTitle}>
                Vui lòng ký tên vào ô bên dưới
              </Text>

              {/* Signature Canvas */}
              <View style={styles.signatureCanvas}>
                <SignatureScreen
                  ref={signatureRef}
                  onOK={handleSignatureOK}
                  onEmpty={handleSignatureEmpty}
                  descriptionText="Ký tên tại đây"
                  clearText="Xóa"
                  confirmText="Xác nhận"
                  webStyle={signatureStyle}
                  autoClear={false}
                  imageType="image/png"
                  penColor="#1F2937"
                  backgroundColor="#F9FAFB"
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.signatureActions}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearSignature}
                >
                  <Feather name="refresh-cw" size={18} color="#EF4444" />
                  <Text style={styles.clearButtonText}>Xóa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmSignature}
                >
                  <MaterialCommunityIcons
                    name="arrow-right-bold"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.confirmButtonText}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <View style={styles.otpContainer}>
              <View style={styles.otpIconContainer}>
                <MaterialCommunityIcons
                  name="shield-lock"
                  size={48}
                  color="#3674B5"
                />
              </View>

              <Text style={styles.otpTitle}>Nhập mã OTP</Text>
              <Text style={styles.otpDescription}>
                Mã OTP đã được gửi đến gmail của bạn
              </Text>

              {/* Signature Preview */}
              <View style={styles.signaturePreview}>
                <Text style={styles.signaturePreviewLabel}>
                  ✓ Chữ ký đã được tạo
                </Text>
                <TouchableOpacity onPress={handleBackToSignature}>
                  <Text style={styles.changeSignatureText}>
                    Thay đổi chữ ký
                  </Text>
                </TouchableOpacity>
              </View>

              {/* OTP Inputs */}
              <View style={styles.otpInputsContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      otpInputs.current[index] = ref;
                    }}
                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Resend OTP */}
              <TouchableOpacity
                onPress={handleResendOtp}
                style={styles.resendButton}
              >
                <Text style={styles.resendText}>Gửi lại mã OTP</Text>
              </TouchableOpacity>

              {/* Verify Button */}
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  isVerifying && styles.verifyButtonDisabled,
                ]}
                onPress={handleVerifyOtp}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <Text style={styles.verifyButtonText}>Đang xác thực...</Text>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.verifyButtonText}>Xác nhận ký</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: height * 0.9,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  contractInfo: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  contractLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  contractNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  // Signature Styles
  signatureContainer: {
    padding: 24,
  },
  signatureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  signatureCanvas: {
    height: 350,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    overflow: "hidden",
    marginBottom: 20,
  },
  signatureActions: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FECACA",
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },
  confirmButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // OTP Styles
  otpContainer: {
    padding: 24,
    alignItems: "center",
  },
  otpIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  otpDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  signaturePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  signaturePreviewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
  },
  changeSignatureText: {
    fontSize: 13,
    color: "#3674B5",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  otpInputsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  otpInputFilled: {
    borderColor: "#3674B5",
    backgroundColor: "#EFF6FF",
  },
  resendButton: {
    paddingVertical: 8,
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3674B5",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    width: "100%",
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default SignatureModal;
