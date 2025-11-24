import ContractHistoryModal from "@/components/Contract/ContractHistoryModal";
import InfoRow from "@/components/Contract/InfoRow";
import NoContractFound from "@/components/Contract/NoContractFound";
import SignatureModal from "@/components/Contract/SignatureModal";
import PDFModal from "@/components/ui/PDFModal";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { useConfirmOtp } from "@/hooks/useConfirmOtp";
import { useGetContractByUserId } from "@/hooks/useGetContractByUserId";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface WorkContractInfoProps {
  userId?: string;
  gmail?: string;
}

const WorkContractInfo: React.FC<WorkContractInfoProps> = ({
  userId,
  gmail,
}) => {
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [signatureOtpError, setSignatureOtpError] = useState("");
  const [contractHistoryModalVisible, setContractHistoryModalVisible] =
    useState(false);
  const {
    data: contractList,
    refetch,
    isLoading,
  } = useGetContractByUserId(userId ?? "");
  const confirmOtp = useConfirmOtp();
  const contractData = contractList?.find(
    (contract) =>
      contract.status !== "INACTIVE" && contract.status !== "EXPIRED",
  );
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value));
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "--";

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Tính số năm, tháng, ngày chênh lệch
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Điều chỉnh nếu ngày âm
    if (days < 0) {
      months--;
      const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += previousMonth.getDate();
    }

    // Điều chỉnh nếu tháng âm
    if (months < 0) {
      years--;
      months += 12;
    }

    // Tạo text hiển thị theo thứ tự: năm > tháng > ngày
    const parts = [];
    if (years > 0) parts.push(`${years} năm`);
    if (months > 0) parts.push(`${months} tháng`);
    if (days > 0) parts.push(`${days} ngày`);

    return parts.length > 0 ? parts.join(" ") : "0 ngày";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang có hiệu lực";
      case "EXPIRED":
        return "Hết hạn";
      case "ACTIVE_EXTENDED":
        return "Có phụ lục hợp đồng";
      case "INACTIVE":
        return "Ngừng có hiệu lực";
      case "PENDING":
        return "Đang chờ";
      case "USER_SIGNED":
        return "Chờ ký hợp đồng";
      case "DIRECTOR_SIGNED":
        return "Chờ giám đốc ký";
      default:
        return status;
    }
  };

  const handleSignContract = () => {
    setSignatureModalVisible(true);
  };

  const handleSignComplete = (signatureBase64: string, otpCode: string) => {
    const formData = new FormData();
    formData.append("otpCode", otpCode);
    formData.append("userContractId", contractData?.id ?? "");
    formData.append("signatureType", "USER");
    formData.append("fileSignUrl", signatureBase64);
    const fileName = `contract_${contractData?.id ?? ""}.png`;
    formData.append("fileSignUrl", {
      uri: signatureBase64,
      type: "image/png",
      name: fileName,
    } as any);

    confirmOtp.mutate(formData, {
      onSuccess: () => {
        refetch();
        setSignatureModalVisible(false);
        setSignatureOtpError("");
        setSuccessAlertVisible(true);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Mã OTP không chính xác. Vui lòng thử lại";
        setSignatureOtpError(message);
      },
    });
  };
  if (!contractData) {
    return <NoContractFound text="Không có hợp đồng" />;
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#3674B5" />
        ) : (
          <>
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Thông tin hợp đồng</Text>
              <InfoRow
                icon="hash"
                value={contractData?.contractNumber ?? ""}
                iconColor="#3B82F6"
                label="Số hợp đồng"
              />
              <InfoRow
                icon="file-text"
                label="Loại hợp đồng"
                value={contractData?.contractTypeName ?? ""}
                iconColor="#3B82F6"
              />
              <InfoRow
                icon="activity"
                label="Tình trạng"
                value={getStatusLabel(contractData?.status ?? "")}
                iconColor="#3B82F6"
              />

              <InfoRow
                icon="calendar"
                label="Ngày bắt đầu"
                value={formatDate(contractData?.startDate ?? "")}
                iconColor="#3B82F6"
              />
              {contractData?.endDate && (
                <InfoRow
                  icon="calendar"
                  label="Ngày kết thúc"
                  value={formatDate(contractData?.endDate ?? "")}
                  iconColor="#EF4444"
                />
              )}
              <InfoRow
                icon="clock"
                label="Thời hạn"
                value={
                  contractData?.endDate
                    ? calculateDuration(
                        contractData?.startDate ?? "",
                        contractData?.endDate ?? "",
                      )
                    : "Vô thời hạn"
                }
                iconColor="#8B5CF6"
              />
            </View>

            {/* Salary Card */}
            <View style={styles.salaryCard}>
              <View style={styles.salaryHeader}>
                <MaterialIcons name="attach-money" size={24} color="#10B981" />
                <Text style={styles.salaryLabel}>Lương cơ bản</Text>
              </View>
              <Text style={styles.salaryAmount}>
                {formatCurrency(contractData?.grossSalary ?? "0")}
              </Text>
              <View style={styles.salaryDivider} />
              {contractData?.allowanceInfors.length > 0 && (
                <View style={styles.allowanceSection}>
                  <Text style={styles.allowanceTitle}>Phụ cấp</Text>
                  {contractData?.allowanceInfors.map((allowance) => (
                    <View
                      key={allowance.allowanceId}
                      style={styles.allowanceItem}
                    >
                      <View style={styles.allowanceLeft}>
                        <View style={styles.allowanceDot} />
                        <Text style={styles.allowanceName}>
                          {allowance.allowanceName}
                        </Text>
                      </View>
                      <Text style={styles.allowanceValue}>
                        {formatCurrency(allowance.value)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Organization Details */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Thông tin chức vụ</Text>

              <InfoRow
                icon="briefcase"
                label="Chức vụ"
                value={contractData?.positionName ?? ""}
                iconColor="#F59E0B"
              />
              <InfoRow
                icon="users"
                label="Phòng ban"
                value={contractData?.departmentName ?? ""}
                iconColor="#EC4899"
              />
              <InfoRow
                icon="user-check"
                label="Quản lý trực tiếp bởi"
                value={contractData?.fullNameManager ?? ""}
                iconColor="#10B981"
              />
            </View>

            {/* View Contract Button */}
            <View style={styles.contractButtonsContainer}>
              <TouchableOpacity
                style={styles.viewContractButton}
                onPress={() => setContractHistoryModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="history"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.viewContractText}>Lịch sử hợp đồng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewContractButton}
                onPress={() => setPdfModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.viewContractText}>Chi tiết hợp đồng</Text>
              </TouchableOpacity>
            </View>
            {/* Sign Contract Button - Only show if status is USER_SIGNED */}
            {contractData?.status === "USER_SIGNED" && (
              <TouchableOpacity
                style={styles.signContractButton}
                onPress={handleSignContract}
              >
                <MaterialCommunityIcons
                  name="draw-pen"
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.signContractText}>Ký hợp đồng</Text>
              </TouchableOpacity>
            )}

            {/* Footer Info */}
            <View style={styles.footerInfo}>
              <Text style={styles.footerText}>
                Cập nhật lần cuối:{" "}
                {new Date(contractData?.updatedAt ?? "").toLocaleString(
                  "vi-VN",
                )}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Signature Modal */}
      <SignatureModal
        visible={signatureModalVisible}
        onClose={() => {
          setSignatureModalVisible(false);
          setSignatureOtpError("");
        }}
        onSignComplete={handleSignComplete}
        contractNumber={contractData?.contractNumber ?? ""}
        userContractId={contractData?.id.toString() ?? ""}
        userGmail={gmail ?? ""}
        externalOtpError={signatureOtpError}
        onClearExternalError={() => setSignatureOtpError("")}
      />

      {/* PDF Modal */}
      <PDFModal
        isVisible={pdfModalVisible}
        onClose={() => setPdfModalVisible(false)}
        pdfUrl={contractData?.fileContract ?? ""}
        title={contractData?.contractNumber ?? ""}
      />

      {/* Success Alert */}
      <SuccessAlert
        visible={successAlertVisible}
        title="Ký thành công!"
        message="Hợp đồng của bạn đã được ký thành công. Chúng tôi sẽ xử lý trong thời gian sớm nhất."
        onClose={() => setSuccessAlertVisible(false)}
        confirmText="Tiếp tục"
        autoClose={false}
        autoCloseDuration={4000}
      />

      {/* Contract History Modal */}
      <ContractHistoryModal
        contractList={contractList ?? []}
        visible={contractHistoryModalVisible}
        onClose={() => setContractHistoryModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  contractNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  contractType: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  contractButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Salary Card
  salaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  salaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  salaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 8,
  },
  salaryAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#10B981",
    marginBottom: 16,
  },
  salaryDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  allowanceSection: {
    gap: 12,
  },
  allowanceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  allowanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  allowanceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  allowanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 10,
  },
  allowanceName: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  allowanceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },

  // Details Card
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "right",
  },

  // View Contract Button
  viewContractButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3674B5",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
    width: "48%",
  },
  viewContractText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 2,
  },

  // Sign Contract Button
  signContractButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
    position: "relative",
    marginTop: 12,
  },
  signContractText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  signBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  signBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Footer
  footerInfo: {
    alignItems: "center",
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
    paddingVertical: 8,
    justifyContent: "center",
    height: "100%",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "center",
  },
});
export default WorkContractInfo;
