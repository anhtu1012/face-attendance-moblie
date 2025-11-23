import { useSendOTPAppendix } from "@/hooks/useSendOTPAppendix";
import { useSendOTPContract } from "@/hooks/useSendOTPContract";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform, 
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";

type SignatureType = "contract" | "appendix";

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSignComplete: (signatureFile: string, otpCode: string) => void;
  contractNumber: string;
  userContractId?: string;
  userContractExtendedId?: string;
  userGmail: string;
  type?: SignatureType;
  externalOtpError?: string;
  onClearExternalError?: () => void;
}

const { height } = Dimensions.get("window");

const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  onClose,
  onSignComplete,
  contractNumber,
  userContractId,
  userContractExtendedId,
  userGmail,
  type = "contract",
  externalOtpError = "",
  onClearExternalError,
}) => {
  const [step, setStep] = useState<"signature" | "otp">("signature");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [signatureBase64, setSignatureBase64] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string>("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const signatureRef = useRef<any>(null);
  const sendOTPContract = useSendOTPContract();
  const sendOTPAppendix = useSendOTPAppendix();
  const otpInputs = useRef<(TextInput | null)[]>([]);

  // Reset isVerifying when external error comes
  useEffect(() => {
    if (externalOtpError) {
      setIsVerifying(false);
    }
  }, [externalOtpError]);

  // Countdown timer for OTP
  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

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

    if (type === "appendix" && userContractExtendedId) {
      sendOTPAppendix.mutate({
        userContractExtendedId: userContractExtendedId,
        userGmail: userGmail,
      });
    } else if (type === "contract" && userContractId) {
      sendOTPContract.mutate({
        userContractId: userContractId,
        userGmail: userGmail,
      });
    }

    setCountdown(60);
    setStep("otp");
  };

  // Handle signature empty
  const handleSignatureEmpty = () => {
    // Empty signature is already handled by the component
    // User can't proceed without signing
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
    // Clear error when user starts typing
    if (otpError) {
      setOtpError("");
    }
    if (externalOtpError && onClearExternalError) {
      onClearExternalError();
    }

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
      setOtpError("Vui lòng nhập đủ 6 chữ số OTP");
      return;
    }
    setIsVerifying(true);
    setOtpError("");

    // Call onSignComplete - parent will handle success/error
    onSignComplete(signatureBase64, otpCode);
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtpError("");
    if (onClearExternalError) {
      onClearExternalError();
    }
    setOtp(["", "", "", "", "", ""]);
    otpInputs.current[0]?.focus();

    // Reset countdown and show success message
    setCountdown(60);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 3000);

    // Resend OTP based on type
    if (type === "appendix" && userContractExtendedId) {
      sendOTPAppendix.mutate({
        userContractExtendedId: userContractExtendedId,
        userGmail: userGmail,
      });
    } else if (type === "contract" && userContractId) {
      sendOTPContract.mutate({
        userContractId: userContractId,
        userGmail: userGmail,
      });
    }
  };

  // Back to signature from OTP
  const handleBackToSignature = () => {
    setStep("signature");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setCountdown(60);
    if (onClearExternalError) {
      onClearExternalError();
    }
  };

  // Close modal and reset
  const handleClose = () => {
    setStep("signature");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setCountdown(60);
    setSignatureBase64("");
    if (onClearExternalError) {
      onClearExternalError();
    }
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
              {step === "otp" ? (
                <TouchableOpacity onPress={handleBackToSignature}>
                  <Feather name="arrow-left" size={24} color="#3674B5" />
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons
                  name="file-sign"
                  size={24}
                  color="#3674B5"
                />
              )}
              <Text style={styles.headerTitle}>
                {step === "signature"
                  ? type === "appendix"
                    ? "Ký phụ lục hợp đồng"
                    : "Ký hợp đồng"
                  : "Xác thực OTP"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
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
                  backgroundColor="#FFFFFF"
                  dataURL={signatureBase64}
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
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.otpContainer}>
                {/* Title */}
                <Text style={styles.otpTitle}>
                  Mã OTP đã được gửi đến gmail của bạn
                </Text>
                <Text style={styles.otpSubtitle}>
                  {countdown > 0
                    ? `Mã có hiệu lực trong ${countdown}s`
                    : "Vui lòng nhập mã hoặc gửi lại"}
                </Text>

                {/* OTP Inputs */}
                <View style={styles.otpInputsContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        otpInputs.current[index] = ref;
                      }}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selection={{ start: digit.length, end: digit.length }}
                    />
                  ))}
                </View>

                {/* Messages */}
                {externalOtpError || otpError ? (
                  <Text style={styles.errorText}>
                    {externalOtpError || otpError}
                  </Text>
                ) : resendSuccess ? (
                  <Text style={styles.successText}>
                    Mã đã được gửi lại gmail của bạn, vui lòng kiểm tra
                  </Text>
                ) : null}

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
                    <Text style={styles.verifyButtonText}>
                      Đang xác thực...
                    </Text>
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
            </KeyboardAvoidingView>
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
    height: height * 0.95,
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
  keyboardAvoidingView: {
    flex: 1,
  },
  otpContainer: {
    padding: 20,
    alignItems: "center",
  },
  otpTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "center",
  },
  otpSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  otpInputsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
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
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  successText: {
    fontSize: 13,
    color: "black",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  resendButton: {
    paddingVertical: 6,
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "600",
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
