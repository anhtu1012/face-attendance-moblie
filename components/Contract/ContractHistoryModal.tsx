import { ContractDetail } from "@/models/contract/dtoContract";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ContractHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  contractList: ContractDetail[];
}

const ContractHistoryModal: React.FC<ContractHistoryModalProps> = ({
  visible,
  onClose,
  contractList,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang có hiệu lực";
      case "EXPIRED":
        return "Hết hạn";
      case "PENDING":
        return "Đang xử lý";
      case "INACTIVE":
        return "Ngừng có hiệu lực";
      case "USER_SIGNED":
        return "Chờ ký hợp đồng";
      case "DIRECTOR_SIGNED":
        return "Chờ giám đốc ký";
      case "ACTIVE_EXTENDED":
        return "Có phụ lục hợp đồng";
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
        return "#F59E0B";
      case "DIRECTOR_SIGNED":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const toggleExpand = (contractId: string) => {
    setExpandedId(expandedId === contractId ? null : contractId);
  };

  const renderContractCard = (contract: ContractDetail) => {
    const isExpanded = expandedId === contract.id;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand(contract.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIconContainer}>
              <Feather name="file-text" size={20} color="#3674B5" />
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.cardNumber}>{contract.contractNumber}</Text>
              <Text style={styles.cardType}>{contract.contractTypeName}</Text>
            </View>
          </View>
          <View style={styles.cardHeaderRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(contract.status)}15` },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(contract.status) },
                ]}
              >
                {getStatusLabel(contract.status)}
              </Text>
            </View>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#6B7280"
              style={styles.chevronIcon}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.cardDetails}>
          {/* Thông tin cơ bản */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Thông tin hợp đồng</Text>
            <DetailRow
              label="Ngày bắt đầu"
              value={formatDate(contract.startDate)}
              icon="calendar"
              iconColor="#3B82F6"
            />
            {contract.endDate && (
              <DetailRow
                label="Ngày kết thúc"
                value={formatDate(contract.endDate)}
                icon="calendar"
                iconColor="#EF4444"
              />
            )}
            <DetailRow
              label="Thời hạn"
              value={
                contract.endDate ? `${contract.duration} tháng` : "Vô thời hạn"
              }
              icon="clock"
              iconColor="#8B5CF6"
            />
          </View>

          {isExpanded && (
            <>
              {/* Lương */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Lương cơ bản</Text>
                <Text style={styles.salaryAmount}>{contract.grossSalary}</Text>
                {contract.allowanceInfors.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.allowanceTitle}>Phụ cấp</Text>
                    {contract.allowanceInfors.map((allowance) => (
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
                          {allowance.value}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>

              {/* Thông tin chức vụ */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Thông tin chức vụ</Text>
                <DetailRow
                  label="Chức vụ"
                  value={contract.positionName}
                  icon="briefcase"
                  iconColor="#F59E0B"
                />
                <DetailRow
                  label="Phòng ban"
                  value={contract.departmentName}
                  icon="users"
                  iconColor="#EC4899"
                />
                <DetailRow
                  label="Quản lý trực tiếp"
                  value={contract.fullNameManager}
                  icon="user-check"
                  iconColor="#10B981"
                />
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lịch sử hợp đồng</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIconButton}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {contractList && contractList.length > 0 ? (
            <FlatList
              data={contractList}
              renderItem={({ item }) => renderContractCard(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>Không có hợp đồng nào</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  icon,
  iconColor,
}) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <View
        style={[styles.detailIconBox, { backgroundColor: `${iconColor}15` }]}
      >
        <Feather name={icon as any} size={16} color={iconColor} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default ContractHistoryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
    paddingBottom: 20,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  closeIconButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
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
    backgroundColor: "#EFF6FF",
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
  cardType: {
    fontSize: 14,
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  detailIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "right",
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
});
