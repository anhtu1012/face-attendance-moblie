import SalaryBarChart from "@/components/Salary/SalaryBarChart";
import SpinnerOverlay from "@/components/SpinnerOverlay";
import MonthPickerModal from "@/components/ui/MonthPickerModal";
import { useGetDailySalarySummary } from "@/hooks/useGetDailySalarySummary";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SalaryHistoryProps {
  userId: number;
}

const SalaryHistory: React.FC<SalaryHistoryProps> = ({ userId }) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Format dates for API
  const getDateRange = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      startTime: startDate.toISOString().split("T")[0],
      endTime: endDate.toISOString().split("T")[0],
    };
  };

  const { startTime, endTime } = getDateRange(selectedYear, selectedMonth);
  const { data, isLoading, refetch } = useGetDailySalarySummary(
    userId,
    startTime,
    endTime
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
    const day = date.getDate();
    return { dayOfWeek, day };
  };

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // Calculate summary
  const summary = {
    totalDays: data?.length || 0,
    totalSalary: data?.reduce((sum, day) => sum + day.totalSalary, 0) || 0,
    otDays: data?.filter((day) => day.hasOT).length || 0,
    holidayDays: data?.filter((day) => day.isHoliday).length || 0,
    totalFines: data?.reduce((sum, day) => sum + day.totalFine, 0) || 0,
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Lịch sử lương</Text>
              <Text style={styles.headerSubtitle}>Chi tiết theo ngày</Text>
            </View>
            <TouchableOpacity
              style={styles.monthSelector}
              onPress={() => setShowMonthPicker(true)}
              activeOpacity={0.8}
            >
              <Feather name="calendar" size={16} color="#3B82F6" />
              <Text style={styles.monthSelectorText}>
                T{selectedMonth}/{selectedYear}
              </Text>
              <Feather name="chevron-down" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconBox}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="#10B981"
              />
            </View>
            <Text style={styles.summaryValue}>{summary.totalDays}</Text>
            <Text style={styles.summaryLabel}>Ngày làm việc</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconBox}>
              <MaterialCommunityIcons
                name="clock-time-eight"
                size={24}
                color="#F59E0B"
              />
            </View>
            <Text style={styles.summaryValue}>{summary.otDays}</Text>
            <Text style={styles.summaryLabel}>Ngày có OT</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconBox}>
              <MaterialCommunityIcons
                name="party-popper"
                size={24}
                color="#EC4899"
              />
            </View>
            <Text style={styles.summaryValue}>{summary.holidayDays}</Text>
            <Text style={styles.summaryLabel}>Ngày lễ</Text>
          </View>
        </View>

        {/* Total Summary */}
        <View style={styles.totalSummary}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng lương tháng</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(summary.totalSalary)}
            </Text>
          </View>
          {summary.totalFines > 0 && (
            <View style={styles.fineRow}>
              <Feather name="alert-circle" size={14} color="#EF4444" />
              <Text style={styles.fineText}>
                Tổng tiền phạt: {formatCurrency(summary.totalFines)}
              </Text>
            </View>
          )}
        </View>

        {/* Bar Chart */}
        {data && data.length > 0 && (
          <View style={styles.section}>
            <SalaryBarChart data={data} />
          </View>
        )}

        {/* Daily List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={22}
              color="#1F2937"
            />
            <Text style={styles.sectionTitle}>Chi tiết theo ngày</Text>
          </View>

          {data && data.length > 0 ? (
            <View style={styles.dailyList}>
              {data.map((day, index) => {
                const { dayOfWeek, day: dayNum } = formatDate(day.date);
                const isWeekend = dayOfWeek === "CN" || dayOfWeek === "T7";

                return (
                  <View
                    key={index}
                    style={[
                      styles.dailyCard,
                      day.isHoliday && styles.dailyCardHoliday,
                    ]}
                  >
                    {/* Left: Date */}
                    <View style={styles.dailyDateBox}>
                      <Text
                        style={[styles.dayOfWeek, isWeekend && styles.weekend]}
                      >
                        {dayOfWeek}
                      </Text>
                      <Text style={styles.dayNumber}>{dayNum}</Text>
                    </View>

                    {/* Middle: Details */}
                    <View style={styles.dailyDetails}>
                      <View style={styles.dailyRow}>
                        <Text style={styles.dailyLabel}>Lương làm việc</Text>
                        <Text style={styles.dailyValue}>
                          {formatCurrency(day.workSalary)}
                        </Text>
                      </View>

                      {day.hasOT && (
                        <View style={styles.dailyRow}>
                          <View style={styles.dailyLabelGroup}>
                            <MaterialCommunityIcons
                              name="clock-plus-outline"
                              size={14}
                              color="#F59E0B"
                            />
                            <Text
                              style={[styles.dailyLabel, { marginLeft: 4 }]}
                            >
                              Lương OT
                            </Text>
                          </View>
                          <Text
                            style={[styles.dailyValue, { color: "#F59E0B" }]}
                          >
                            +{formatCurrency(day.otSalary)}
                          </Text>
                        </View>
                      )}

                      {day.totalFine > 0 && (
                        <View style={styles.dailyRow}>
                          <View style={styles.dailyLabelGroup}>
                            <Feather
                              name="alert-triangle"
                              size={14}
                              color="#EF4444"
                            />
                            <Text
                              style={[styles.dailyLabel, { marginLeft: 4 }]}
                            >
                              Tiền phạt
                            </Text>
                          </View>
                          <Text
                            style={[styles.dailyValue, { color: "#EF4444" }]}
                          >
                            -{formatCurrency(day.totalFine)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Right: Total */}
                    <View style={styles.dailyTotalBox}>
                      <Text style={styles.dailyTotalLabel}>Tổng</Text>
                      <Text style={styles.dailyTotalValue}>
                        {formatCurrency(day.totalSalary)}
                      </Text>
                    </View>

                    {/* Badges */}
                    <View style={styles.badgeContainer}>
                      {day.isHoliday && (
                        <View style={styles.holidayBadge}>
                          <MaterialCommunityIcons
                            name="party-popper"
                            size={10}
                            color="#EC4899"
                          />
                          <Text style={styles.holidayBadgeText}>Lễ</Text>
                        </View>
                      )}
                      {day.hasOT && (
                        <View style={styles.otBadge}>
                          <Feather name="clock" size={10} color="#F59E0B" />
                          <Text style={styles.otBadgeText}>OT</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="calendar-remove"
                size={64}
                color="#D1D5DB"
              />
              <Text style={styles.emptyText}>Không có dữ liệu lương</Text>
              <Text style={styles.emptySubtext}>
                Chọn tháng khác để xem lịch sử
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Month Picker Modal */}
      <MonthPickerModal
        showMonthPicker={showMonthPicker}
        setShowMonthPicker={setShowMonthPicker}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        handleMonthSelect={handleMonthSelect}
        currentDate={currentDate}
      />

      {isLoading && (
        <SpinnerOverlay visible={isLoading} content="Đang tải lịch sử..." />
      )}
    </>
  );
};

export default SalaryHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  // Header
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  monthSelectorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },

  // Summary Container
  summaryContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },

  // Total Summary
  totalSummary: {
    backgroundColor: "#DBEAFE",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E40AF",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E40AF",
  },
  fineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  fineText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "500",
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
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

  // Daily List
  dailyList: {
    gap: 12,
  },
  dailyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  dailyCardHoliday: {
    borderLeftWidth: 4,
    borderLeftColor: "#EC4899",
  },
  dailyDateBox: {
    position: "absolute",
    top: 16,
    left: 16,
    alignItems: "center",
    width: 50,
  },
  dayOfWeek: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  weekend: {
    color: "#EF4444",
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
  },
  dailyDetails: {
    marginLeft: 70,
    marginRight: 100,
    gap: 8,
  },
  dailyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dailyLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  dailyLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  dailyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  dailyTotalBox: {
    position: "absolute",
    top: 16,
    right: 16,
    alignItems: "flex-end",
  },
  dailyTotalLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },
  dailyTotalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3B82F6",
  },
  badgeContainer: {
    position: "absolute",
    bottom: 12,
    right: 16,
    flexDirection: "row",
    gap: 6,
  },
  holidayBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  holidayBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#EC4899",
  },
  otBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  otBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#F59E0B",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
});
