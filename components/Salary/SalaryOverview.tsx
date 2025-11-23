import { useGetSalarySummary } from "@/hooks/useGetSalarySummary";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SalaryOverviewProps {
  userId: string;
  selectedMonth: number;
  selectedYear: number;
}

const SalaryOverview: React.FC<SalaryOverviewProps> = ({
  userId,
  selectedMonth,
  selectedYear,
}) => {
  // State for showing/hiding salary amounts (default hidden for privacy)
  const [showSalary, setShowSalary] = useState(false);
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetSalarySummary(
    userId,
    selectedMonth
  );

  // Reset showSalary to false when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      setShowSalary(false);
    }
  }, [isFocused]);

  const formatCurrency = (amount: number) => {
    if (!showSalary) {
      return "********";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const salaryItems = [
    {
      label: "Lương cơ bản",
      amount: data?.grossSalary || 0,
      icon: "wallet-outline",
      color: "#10B981",
      bgColor: "#ECFDF5",
    },
    {
      label: "Lương OT",
      amount: data?.totalOtSalary || 0,
      icon: "clock-time-four-outline",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
    },
    {
      label: "Phụ cấp",
      amount: data?.totalAllowance || 0,
      icon: "gift-outline",
      color: "#3B82F6",
      bgColor: "#DBEAFE",
    },
    {
      label: "Tiền phạt",
      amount: data?.totalFine || 0,
      icon: "alert-circle-outline",
      color: "#EF4444",
      bgColor: "#FEE2E2",
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#3674B5"]}
            tintColor="#3674B5"
          />
        }
      >
        {/* Header */}
        <LinearGradient colors={["#3674B5", "#3674B5"]} style={styles.header}>
          <View style={styles.headerTop}></View>
        </LinearGradient>

        {/* Total Salary Card */}
        <View style={styles.totalCard}>
          <LinearGradient
            colors={["#FFFFFF", "#F9FAFB"]}
            style={styles.totalCardGradient}
          >
            <View style={styles.totalIconContainer}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={40}
                color="#3674B5"
              />
            </View>
            <Text style={styles.totalLabel}>Tổng lương hiện tại</Text>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmount}>
                {formatCurrency(data?.totalSalary || 0)}
              </Text>
              <TouchableOpacity
                onPress={() => setShowSalary(!showSalary)}
                style={styles.eyeIconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showSalary ? (
                  <Eye size={24} color="#3674B5" />
                ) : (
                  <EyeOff size={24} color="#3674B5" />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.totalBadge}>
              <Feather name="check-circle" size={14} color="#3674B5" />
              <Text style={styles.totalBadgeText}>
                Tháng {selectedMonth}/{selectedYear}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Salary Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chi tiết lương</Text>
          </View>

          <View style={styles.salaryGrid}>
            {salaryItems.map((item, index) => (
              <View key={index} style={styles.salaryCard}>
                <View
                  style={[
                    styles.salaryIconBox,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <Text style={styles.salaryLabel}>{item.label}</Text>
                <Text
                  style={[
                    styles.salaryAmount,
                    { color: item.amount < 0 ? "#EF4444" : "#1F2937" },
                  ]}
                >
                  {item.amount < 0 || item.label === "Lương cơ bản"
                    ? ""
                    : item.label === "Tiền phạt"
                    ? ""
                    : ""}
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calculation Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tính toán lương</Text>
          </View>

          <View style={styles.calculationCard}>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Lương cơ bản</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(data?.grossSalary || 0)}
              </Text>
            </View>
            <View style={styles.calculationDivider} />

            <View style={styles.calculationRow}>
              <View style={styles.calculationLabelGroup}>
                <Feather name="plus" size={14} color="#10B981" />
                <Text style={[styles.calculationLabel, { marginLeft: 6 }]}>
                  Lương OT
                </Text>
              </View>
              <Text style={[styles.calculationValue, { color: "#10B981" }]}>
                {formatCurrency(data?.totalOtSalary || 0)}
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <View style={styles.calculationLabelGroup}>
                <Feather name="plus" size={14} color="#10B981" />
                <Text style={[styles.calculationLabel, { marginLeft: 6 }]}>
                  Phụ cấp
                </Text>
              </View>
              <Text style={[styles.calculationValue, { color: "#10B981" }]}>
                {formatCurrency(data?.totalAllowance || 0)}
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <View style={styles.calculationLabelGroup}>
                <Feather name="minus" size={14} color="#EF4444" />
                <Text style={[styles.calculationLabel, { marginLeft: 6 }]}>
                  Tiền phạt
                </Text>
              </View>
              <Text style={[styles.calculationValue, { color: "#EF4444" }]}>
                {formatCurrency(data?.totalFine || 0)}
              </Text>
            </View>

            <View style={styles.calculationDivider} />

            <View style={[styles.calculationRow, styles.calculationTotal]}>
              <Text style={styles.calculationTotalLabel}>Tổng thực nhận</Text>
              <Text style={styles.calculationTotalValue}>
                {formatCurrency(data?.totalSalary || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Feather name="info" size={16} color="#6B7280" />
          <Text style={styles.infoNoteText}>
            Lương đã bao gồm các khoản phụ cấp và trừ tiền phạt (nếu có)
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default SalaryOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },

  // Total Card
  totalCard: {
    marginTop: -70,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  totalCardGradient: {
    padding: 24,
    alignItems: "center",
  },
  totalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  totalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#3674B5",
  },
  eyeIconButton: {
    padding: 4,
  },
  totalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3674B5",
  },

  // Section
  section: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  // Salary Grid
  salaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  salaryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  salaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  salaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
  },
  salaryAmount: {
    fontSize: 18,
    fontWeight: "700",
  },

  // Calculation Card
  calculationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  calculationLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  calculationLabel: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  calculationValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  calculationDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  calculationTotal: {
    paddingTop: 16,
  },
  calculationTotalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  calculationTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
  },

  // Info Note
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
});
