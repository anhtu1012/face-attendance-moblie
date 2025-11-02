import InfoRow from "@/components/Contract/InfoRow";
import NoContractFound from "@/components/Contract/NoContractFound";
import PDFModal from "@/components/ui/PDFModal";
import { useGetAppendixByUserContractId } from "@/hooks/useGetAppendixByUserContractId";
import { useGetContractByUserId } from "@/hooks/useGetContractByUserId";
import { Appendix } from "@/models/contract/dtoAppendix";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AppendixTab = ({ userId }: { userId: string | undefined }) => {
  const { data: contractList } = useGetContractByUserId(userId ?? "");
  const contractData = contractList?.find(
    (contract) =>
      contract.status !== "INACTIVE" && contract.status !== "EXPIRED"
  );
  const { data: appendixList } = useGetAppendixByUserContractId(
    contractData?.id ?? ""
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("");

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
    return `${parseInt(value).toLocaleString("vi-VN")} ₫`;
  };

  const formatDuration = (minutes: string) => {
    const totalMinutes = parseInt(minutes);
    if (isNaN(totalMinutes) || totalMinutes <= 0) return "Vô thời hạn";

    const minutesPerDay = 24 * 60; // 1440 phút
    const minutesPerMonth = 30 * minutesPerDay; // 43200 phút (giả sử 1 tháng = 30 ngày)
    const minutesPerYear = 365 * minutesPerDay; // 525600 phút (1 năm = 365 ngày)

    // Tính số năm
    const years = Math.floor(totalMinutes / minutesPerYear);
    let remainingMinutes = totalMinutes % minutesPerYear;

    // Tính số tháng
    const months = Math.floor(remainingMinutes / minutesPerMonth);
    remainingMinutes = remainingMinutes % minutesPerMonth;

    // Tính số ngày
    const days = Math.floor(remainingMinutes / minutesPerDay);

    // Tạo chuỗi kết quả
    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? "năm" : "năm"}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? "tháng" : "tháng"}`);
    }
    if (days > 0) {
      parts.push(`${days} ${days === 1 ? "ngày" : "ngày"}`);
    }

    // Nếu không có gì thì hiển thị số phút
    if (parts.length === 0) {
      return `${totalMinutes} phút`;
    }

    return parts.join(" ");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang có hiệu lực";
      case "EXPIRED":
        return "Hết hạn";
      case "INACTIVE":
        return "Ngừng có hiệu lực";
      case "USER_SIGNED":
        return "Chờ ký hợp đồng";
      case "DIRECTOR_SIGNED":
        return "Chờ giám đốc ký";
      case "PENDING":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#10B981";
      case "EXPIRED":
        return "#EF4444";
      case "INACTIVE":
        return "#6B7280";
      case "USER_SIGNED":
      case "DIRECTOR_SIGNED":
        return "#F59E0B";
      case "PENDING":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const handleViewPDF = (fileContract: string, contractNumber: string) => {
    if (fileContract) {
      setSelectedPdfUrl(fileContract);
      setSelectedPdfTitle(contractNumber);
      setPdfModalVisible(true);
    }
  };

  const renderAppendixCard = (appendix: Appendix) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIconContainer}>
              <Feather name="file-plus" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.cardNumber}>{appendix.contractNumber}</Text>
              <Text style={styles.cardSubtext}>
                {formatDate(appendix.startDate)} -{" "}
                {formatDate(appendix.endDate)}
              </Text>
            </View>
          </View>
          <View style={styles.cardHeaderRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(appendix.status)}15` },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(appendix.status) },
                ]}
              >
                {getStatusLabel(appendix.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDetails}>
          {/* Thông tin cơ bản */}
          <View style={styles.detailSection}>
            <InfoRow
              label="Thời hạn"
              value={
                appendix.endDate
                  ? formatDuration(appendix.duration)
                  : "Vô thời hạn"
              }
              icon="clock"
              iconColor="#8B5CF6"
            />
            <InfoRow
              label="Lương"
              value={formatCurrency(appendix.grossSalary)}
              icon="dollar-sign"
              iconColor="#10B981"
            />
          </View>

          <>
            {/* Lương */}
            <View style={styles.detailSection}>
              {appendix.allowanceInfors.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.allowanceTitle}>Phụ cấp</Text>
                  {appendix.allowanceInfors.map((allowance) => (
                    <View
                      key={allowance.allowanceId}
                      style={styles.allowanceRow}
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
                </>
              )}
            </View>

            {/* Nội dung */}
            {appendix.content && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Nội dung</Text>
                <View style={styles.contentBox}>
                  <Text style={styles.contentText}>{appendix.content}</Text>
                </View>
              </View>
            )}

            {/* File PDF */}
            {appendix.fileContract && (
              <View style={styles.detailSection}>
                <TouchableOpacity
                  style={styles.pdfButton}
                  onPress={() =>
                    handleViewPDF(
                      appendix.fileContract!,
                      appendix.contractNumber
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.pdfButtonText}>Xem file hợp đồng</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </View>
      </View>
    );
  };

  if (!appendixList || appendixList.length === 0) {
    return <NoContractFound text="Không có phụ lục hợp đồng" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {appendixList.map((appendix) => (
            <View key={appendix.id}>{renderAppendixCard(appendix)}</View>
          ))}
        </View>
      </ScrollView>

      {/* PDF Modal */}
      <PDFModal
        isVisible={pdfModalVisible}
        onClose={() => setPdfModalVisible(false)}
        pdfUrl={selectedPdfUrl}
        title={selectedPdfTitle}
      />
    </View>
  );
};

export default AppendixTab;

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
    paddingBottom: 20,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    padding: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  salaryAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  allowanceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  allowanceRow: {
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
  contentBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  pdfButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  pdfButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 16,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});
