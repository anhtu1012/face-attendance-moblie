import SalaryBarChart from "@/components/Salary/SalaryBarChart";
import { useGetDailySalarySummary } from "@/hooks/useGetDailySalarySummary";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

interface SalaryHistoryProps {
  userId: number;
  startTime: string;
  endTime: string;
  selectedMonth: number;
  selectedYear: number;
}

const SalaryHistory: React.FC<SalaryHistoryProps> = ({
  userId,
  startTime,
  endTime,
  selectedMonth,
  selectedYear,
}) => {
  const { data, isLoading, refetch } = useGetDailySalarySummary(
    userId,
    startTime,
    endTime
  );

  // State for current week pagination
  const [currentWeek, setCurrentWeek] = useState(() =>
    dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .startOf("month")
  );

  // Reset to first week of month when month/year changes
  useEffect(() => {
    setCurrentWeek(
      dayjs()
        .year(selectedYear)
        .month(selectedMonth - 1)
        .startOf("month")
    );
  }, [selectedMonth, selectedYear]);

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

  // Calculate week range display
  const weekRange = useMemo(() => {
    const startOfWeek = currentWeek.startOf("isoWeek");
    const endOfWeek = currentWeek.endOf("isoWeek");
    return `Tuần ${startOfWeek.format("DD/MM")} - ${endOfWeek.format("DD/MM")}`;
  }, [currentWeek]);

  // Get current week's data
  const currentWeekData = useMemo(() => {
    if (!data) return [];

    const startOfWeek = currentWeek.startOf("isoWeek");
    const endOfWeek = currentWeek.endOf("isoWeek");

    return data.filter((day) => {
      const dayDate = dayjs(day.date);
      return dayDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
    });
  }, [data, currentWeek]);

  // Week navigation handlers
  const handlePrevWeek = () => setCurrentWeek(currentWeek.subtract(1, "week"));
  const handleNextWeek = () => setCurrentWeek(currentWeek.add(1, "week"));

  // Calculate week summary
  const weekSummary = useMemo(() => {
    return {
      totalDays: currentWeekData.length,
      totalSalary: currentWeekData.reduce(
        (sum, day) => sum + day.totalSalary,
        0
      ),
      otDays: currentWeekData.filter((day) => day.hasOT).length,
      holidayDays: currentWeekData.filter((day) => day.isHoliday).length,
      totalFines: currentWeekData.reduce((sum, day) => sum + day.totalFine, 0),
    };
  }, [currentWeekData]);

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Lịch sử lương</Text>
              <Text style={styles.headerSubtitle}>Chi tiết theo ngày</Text>
            </View>
          </View>
        </View>

        {/* Week Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconBox}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="#10B981"
              />
            </View>
            <Text style={styles.summaryValue}>{weekSummary.totalDays}</Text>
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
            <Text style={styles.summaryValue}>{weekSummary.otDays}</Text>
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
            <Text style={styles.summaryValue}>{weekSummary.holidayDays}</Text>
            <Text style={styles.summaryLabel}>Ngày lễ</Text>
          </View>
        </View>

        {/* Week Total Summary */}
        <View style={styles.totalSummary}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng lương tuần</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(weekSummary.totalSalary)}
            </Text>
          </View>
          {weekSummary.totalFines > 0 && (
            <View style={styles.fineRow}>
              <Feather name="alert-circle" size={14} color="#EF4444" />
              <Text style={styles.fineText}>
                Tổng tiền phạt: {formatCurrency(weekSummary.totalFines)}
              </Text>
            </View>
          )}
        </View>

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.navButton}>
            <ChevronLeft color="#3B82F6" size={24} />
          </TouchableOpacity>

          <Text style={styles.weekNavigationText}>{weekRange}</Text>

          <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
            <ChevronRight color="#3B82F6" size={24} />
          </TouchableOpacity>
        </View>

        {/* Bar Chart */}
        {currentWeekData && currentWeekData.length > 0 && (
          <View style={styles.section}>
            <SalaryBarChart data={currentWeekData} />
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

          {currentWeekData && currentWeekData.length > 0 ? (
            <View style={styles.dailyList}>
              {currentWeekData.map((day, index) => {
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
                    {/* Top Row: Date and Total */}
                    <View style={styles.dailyTopRow}>
                      {/* Left: Date */}
                      <View style={styles.dailyDateBox}>
                        <Text
                          style={[
                            styles.dayOfWeek,
                            isWeekend && styles.weekend,
                          ]}
                        >
                          {dayOfWeek}
                        </Text>
                        <Text style={styles.dayNumber}>{dayNum}</Text>
                      </View>

                      {/* Right: Total */}
                      <View style={styles.dailyTotalBox}>
                        <Text style={styles.dailyTotalLabel}>Tổng lương</Text>
                        <Text style={styles.dailyTotalValue}>
                          {formatCurrency(day.totalSalary)}
                        </Text>
                      </View>
                    </View>

                    {/* Details Section */}
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

                    {/* Badges */}
                    {(day.isHoliday || day.hasOT) && (
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
                    )}
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
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default SalaryHistory;

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
    padding: 20,
    paddingTop: 10,
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
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

  // Week Navigation
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  weekNavigationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E40AF",
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
  },
  dailyCardHoliday: {
    borderLeftWidth: 4,
    borderLeftColor: "#EC4899",
  },
  dailyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dailyDateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
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
    gap: 10,
    marginBottom: 12,
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
    alignItems: "flex-end",
  },
  dailyTotalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  dailyTotalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
  },
  badgeContainer: {
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
