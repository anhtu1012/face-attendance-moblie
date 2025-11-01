import SignatureModal from "@/components/Contract/SignatureModal";
import ErrorAlert from "@/components/ui/ErrorAlert";
import PDFModal from "@/components/ui/PDFModal";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { useConfirmOtp } from "@/hooks/useConfirmOtp";
import { useGetContractByUserId } from "@/hooks/useGetContractByUserId";
import { ContractDetail } from "@/models/contract/dtoContract";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

const mockContractData: ContractDetail = {
  id: "15",
  createdAt: "2025-10-28T15:34:24.699Z",
  updatedAt: "2025-10-28T15:34:24.699Z",
  userId: "13",
  fullNameUser: "Phạm Hoàng Phúc",
  manageByUserId: "14",
  fullNameManager: "Lê Minh",
  departmentId: "1",
  departmentName: "Phòng Phát triển phần mềm",
  positionId: "7",
  positionName: "Frontend Developer",
  contractTypeId: "1",
  contractTypeName: "Hợp đồng dịch vụ",
  companyId: "10",
  grossSalary: "25.000.000",
  contractNumber: "002/2025-FAAS",
  fileContract:
    "http://minio-api.faceattendance.dev/faas/contract/15/1761738179174-contract (2).pdf",
  startDate: "2025-11-02T17:00:00.000Z",
  endDate: null,
  duration: "0",
  status: "USER_SIGNED",
  allowanceInfors: [
    {
      allowanceId: "4",
      allowanceName: "Ăn trưa",
      allowanceCode: "ALLOWANCE-001",
      value: "50000",
    },
  ],
};

const WorkContractInfo: React.FC<WorkContractInfoProps> = ({
  userId,
  gmail,
}) => {
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [errorAlertVisible, setErrorAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: contractList, refetch } = useGetContractByUserId(userId ?? "");
  const confirmOtp = useConfirmOtp();
  const contractData = contractList?.find(
    (contract) =>
      contract.status !== "INACTIVE" && contract.status !== "EXPIRED"
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
    return `${value} ₫`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "#ECFDF5",
          text: "#065F46",
          border: "#A7F3D0",
        };
      case "EXPIRED":
        return {
          bg: "#FEE2E2",
          text: "#991B1B",
          border: "#FECACA",
        };
      case "PENDING":
        return {
          bg: "#FFFBEB",
          text: "#92400E",
          border: "#FCD34D",
        };
      default:
        return {
          bg: "#F3F4F6",
          text: "#4B5563",
          border: "#D1D5DB",
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "EXPIRED":
        return "Hết hạn";
      case "PENDING":
        return "Chờ xử lý";
      case "INACTIVE":
        return "Ngừng hoạt động";
      case "USER_SIGNED":
        return "Chờ người dùng ký";
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
        setSuccessAlertVisible(true);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Không thể ký hợp đồng. Vui lòng thử lại!";
        setErrorMessage(message);
        setErrorAlertVisible(true);
      },
    });
  };

  const statusColors = getStatusColor(contractData?.status ?? "");

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={28}
                  color="#3674B5"
                />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.contractNumber}>
                  {contractData?.contractNumber}
                </Text>
                <Text style={styles.contractType}>
                  {contractData?.contractTypeName}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColors.bg,
                  borderColor: statusColors.border,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {getStatusLabel(contractData?.status ?? "")}
              </Text>
            </View>
          </View>
        </View>

        {/* Salary Card */}
        <View style={styles.salaryCard}>
          <View style={styles.salaryHeader}>
            <MaterialIcons name="attach-money" size={24} color="#10B981" />
            <Text style={styles.salaryLabel}>Tổng lương</Text>
          </View>
          <Text style={styles.salaryAmount}>
            {formatCurrency(contractData?.grossSalary ?? "0")}
          </Text>
          <View style={styles.salaryDivider} />
          <View style={styles.allowanceSection}>
            <Text style={styles.allowanceTitle}>Phụ cấp</Text>
            {contractData?.allowanceInfors.map((allowance) => (
              <View key={allowance.allowanceId} style={styles.allowanceItem}>
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
        </View>

        {/* Contract Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Thông tin hợp đồng</Text>

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
                ? `${contractData?.duration} tháng`
                : "Vô thời hạn"
            }
            iconColor="#8B5CF6"
          />
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
            label="Quản lý trực tiếp"
            value={contractData?.fullNameManager ?? ""}
            iconColor="#10B981"
          />
        </View>

        {/* View Contract Button */}
        <TouchableOpacity
          style={styles.viewContractButton}
          onPress={() => setPdfModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.viewContractText}>Xem hợp đồng PDF</Text>
          <Feather name="external-link" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Sign Contract Button - Only show if status is USER_SIGNED */}
        {contractData?.status === "USER_SIGNED" && (
          <TouchableOpacity
            style={styles.signContractButton}
            onPress={handleSignContract}
          >
            <MaterialCommunityIcons name="draw-pen" size={24} color="#FFFFFF" />
            <Text style={styles.signContractText}>Ký hợp đồng</Text>
          </TouchableOpacity>
        )}

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Cập nhật lần cuối:{" "}
            {new Date(contractData?.updatedAt ?? "").toLocaleString("vi-VN")}
          </Text>
        </View>
      </ScrollView>

      {/* Signature Modal */}
      <SignatureModal
        visible={signatureModalVisible}
        onClose={() => setSignatureModalVisible(false)}
        onSignComplete={handleSignComplete}
        contractNumber={contractData?.contractNumber ?? ""}
        userContractId={contractData?.id.toString() ?? ""}
        userGmail={gmail ?? ""}
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

      {/* Error Alert */}
      <ErrorAlert
        visible={errorAlertVisible}
        title="Ký thất bại!"
        message={errorMessage}
        onClose={() => setErrorAlertVisible(false)}
        onRetry={() => {
          setErrorAlertVisible(false);
          setSignatureModalVisible(true);
        }}
        showRetry={true}
        retryText="Thử lại"
        closeText="Đóng"
      />
    </View>
  );
};

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, iconColor }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <View style={[styles.infoIconBox, { backgroundColor: `${iconColor}15` }]}>
        <Feather name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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

  // Header Card
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
    marginBottom: 12,
    shadowColor: "#3674B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  viewContractText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 4,
  },

  // Sign Contract Button
  signContractButton: {
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
});

export default WorkContractInfo;
