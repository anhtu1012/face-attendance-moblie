import YearlySalaryChart from "@/components/Salary/YearlySalaryChart";
import { useGetYearlySalaryReport } from "@/hooks/useGetYearlySalaryReport";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface YearlySalaryViewProps {
  userId: string;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const YearlySalaryView: React.FC<YearlySalaryViewProps> = ({
  userId,
  selectedYear,
  onYearChange,
}) => {
  const {
    data: yearlySalaryData,
    isLoading,
    refetch,
  } = useGetYearlySalaryReport(userId, selectedYear);

  // State for showing/hiding salary amounts (default hidden for privacy)
  const [showSalary, setShowSalary] = useState(false);
  const isFocused = useIsFocused();

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetch();
      }
    }, [userId, refetch])
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

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Chart */}
        {yearlySalaryData?.data && yearlySalaryData.data.length > 0 && (
          <View style={[styles.section, { marginTop: 20 }]}>
            <YearlySalaryChart
              data={yearlySalaryData.data}
              showSalary={showSalary}
              onToggleVisibility={() => setShowSalary(!showSalary)}
            />
          </View>
        )}

        {/* Monthly List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chi tiết theo tháng</Text>
          </View>

          {yearlySalaryData?.data && yearlySalaryData.data.length > 0 ? (
            <View style={styles.monthlyList}>
              {yearlySalaryData.data.map((month, index) => (
                <View key={index} style={styles.monthCard}>
                  <View style={styles.monthHeader}>
                    <View style={styles.monthHeaderLeft}>
                      <View style={styles.monthIconBox}>
                        <MaterialCommunityIcons
                          name="calendar-month"
                          size={20}
                          color="#3674B5"
                        />
                      </View>
                      <View>
                        <Text style={styles.monthTitle}>
                          Tháng {month.date}
                        </Text>
                        <Text style={styles.monthSubtitle}>
                          {month.totalWorkDay} ngày • {month.totalWorkHour} giờ
                        </Text>
                      </View>
                    </View>
                    <View style={styles.monthTotalBox}>
                      <Text style={styles.monthTotalLabel}>Tổng lương</Text>
                      <Text style={styles.monthTotalValue}>
                        {formatCurrency(month.totalSalary)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.monthDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Lương cơ bản</Text>
                      <Text style={styles.detailValue}>
                        {formatCurrency(month.workSalary)}
                      </Text>
                    </View>

                    {month.otSalary > 0 && (
                      <View style={styles.detailRow}>
                        <View style={styles.detailLabelGroup}>
                          <MaterialCommunityIcons
                            name="clock-plus-outline"
                            size={14}
                            color="#F59E0B"
                          />
                          <Text style={styles.detailLabel}>Lương OT</Text>
                        </View>
                        <Text
                          style={[styles.detailValue, { color: "#F59E0B" }]}
                        >
                          {formatCurrency(month.otSalary)}
                        </Text>
                      </View>
                    )}

                    {month.totalAllowance > 0 && (
                      <View style={styles.detailRow}>
                        <View style={styles.detailLabelGroup}>
                          <MaterialCommunityIcons
                            name="gift-outline"
                            size={14}
                            color="#059669"
                          />
                          <Text style={styles.detailLabel}>Phụ cấp</Text>
                        </View>
                        <Text
                          style={[styles.detailValue, { color: "#059669" }]}
                        >
                          {formatCurrency(month.totalAllowance)}
                        </Text>
                      </View>
                    )}

                    {month.totalFine > 0 && (
                      <View style={styles.detailRow}>
                        <View style={styles.detailLabelGroup}>
                          <Feather
                            name="alert-triangle"
                            size={14}
                            color="#EF4444"
                          />
                          <Text style={styles.detailLabel}>Tiền phạt</Text>
                        </View>
                        <Text
                          style={[styles.detailValue, { color: "#EF4444" }]}
                        >
                          {formatCurrency(month.totalFine)}
                        </Text>
                      </View>
                    )}

                    {month.lateCount > 0 && (
                      <View style={styles.detailRow}>
                        <View style={styles.detailLabelGroup}>
                          <MaterialCommunityIcons
                            name="clock-alert-outline"
                            size={14}
                            color="#F59E0B"
                          />
                          <Text style={styles.detailLabel}>Đi muộn</Text>
                        </View>
                        <Text style={styles.detailValue}>
                          {month.lateCount} lần
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="calendar-remove"
                size={64}
                color="#D1D5DB"
              />
              <Text style={styles.emptyText}>
                Không có dữ liệu lương năm {selectedYear}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default YearlySalaryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  monthlyList: {
    gap: 12,
  },
  monthCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  monthHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  monthIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  monthSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  monthTotalBox: {
    alignItems: "flex-end",
  },
  monthTotalLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  monthTotalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#10B981",
  },
  monthDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
});
