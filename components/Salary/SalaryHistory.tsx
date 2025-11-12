import SalaryBarChart from "@/components/Salary/SalaryBarChart";
import { useGetDailySalarySummary } from "@/hooks/useGetDailySalarySummary";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
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
  userId: string;
  fromDate: string;
  toDate: string;
  selectedMonth: number;
  selectedYear: number;
}

const SalaryHistory: React.FC<SalaryHistoryProps> = ({
  userId,
  fromDate,
  toDate,
  selectedMonth,
  selectedYear,
}) => {
  const {
    data: dailySalarySummaryData,
    isLoading,
    refetch,
  } = useGetDailySalarySummary(userId, fromDate, toDate);

  // State for showing/hiding salary amounts (default hidden for privacy)
  const [showSalary, setShowSalary] = useState(false);
  const isFocused = useIsFocused();

  // Reset showSalary to false when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      setShowSalary(false);
    }
  }, [isFocused]);

  // Helper function to get the start of week (Monday-based)
  const getWeekStart = (date: dayjs.Dayjs) => {
    const dayOfWeek = date.day(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return date.subtract(daysFromMonday, "day").startOf("day");
  };

  // Get initial start date - current week for current month, otherwise first day
  const getInitialStartDate = (year: number, month: number) => {
    const today = dayjs();
    const monthStart = dayjs()
      .year(year)
      .month(month - 1)
      .startOf("month");
    const monthEnd = dayjs()
      .year(year)
      .month(month - 1)
      .endOf("month");

    // If viewing current month, show current week
    if (year === today.year() && month === today.month() + 1) {
      const weekStart = getWeekStart(today);

      // Ensure week start is within the month
      if (weekStart.isBefore(monthStart)) {
        return monthStart;
      }
      if (weekStart.isAfter(monthEnd)) {
        return monthStart;
      }

      return weekStart;
    }

    // For other months, start from first day
    return monthStart;
  };

  // State for current period pagination (7 days starting from current week or day 1)
  const [currentStartDate, setCurrentStartDate] = useState(() =>
    getInitialStartDate(selectedYear, selectedMonth)
  );

  // Reset to appropriate start date when month/year changes
  useEffect(() => {
    setCurrentStartDate(getInitialStartDate(selectedYear, selectedMonth));
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (amount: number) => {
    if (!showSalary) {
      return "********";
    }
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

  // Calculate period range display (7 days)
  const weekRange = useMemo(() => {
    const startDate = currentStartDate.clone();
    const endDate = currentStartDate.clone().add(6, "day");
    const monthEnd = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .endOf("month");

    // Ensure end date doesn't exceed month end
    const actualEndDate = endDate.isAfter(monthEnd) ? monthEnd : endDate;

    return `${startDate.format("DD/MM")} - ${actualEndDate.format("DD/MM")}`;
  }, [currentStartDate, selectedMonth, selectedYear]);

  // Get current period's data (7 days, only within selected month)
  const currentWeekData = useMemo(() => {
    if (!dailySalarySummaryData) return [];

    const monthStart = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .date(1);
    const monthEnd = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .endOf("month");

    const periodStart = currentStartDate.clone();
    const periodEnd = currentStartDate.clone().add(6, "day");

    // Ensure period doesn't exceed month boundaries
    const actualStart = periodStart.isBefore(monthStart)
      ? monthStart
      : periodStart;
    const actualEnd = periodEnd.isAfter(monthEnd) ? monthEnd : periodEnd;

    return dailySalarySummaryData.filter((day) => {
      const dayDate = dayjs(day.date);
      // Only include days within the selected month
      if (
        dayDate.month() !== selectedMonth - 1 ||
        dayDate.year() !== selectedYear
      ) {
        return false;
      }
      return dayDate.isBetween(actualStart, actualEnd, "day", "[]");
    });
  }, [dailySalarySummaryData, currentStartDate, selectedMonth, selectedYear]);

  // Check navigation availability
  const canGoPrev = useMemo(() => {
    const monthStart = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .startOf("month");
    return currentStartDate.isAfter(monthStart);
  }, [currentStartDate, selectedMonth, selectedYear]);

  const canGoNext = useMemo(() => {
    const monthEnd = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .endOf("month");
    return currentStartDate.clone().add(6, "day").isBefore(monthEnd);
  }, [currentStartDate, selectedMonth, selectedYear]);

  // Period navigation handlers
  const handlePrevWeek = () => {
    if (!canGoPrev) return;

    const prevStart = currentStartDate.clone().subtract(7, "day");
    const monthStart = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .startOf("month");

    setCurrentStartDate(
      prevStart.isBefore(monthStart) ? monthStart : prevStart
    );
  };

  const handleNextWeek = () => {
    if (!canGoNext) return;

    const nextStart = currentStartDate.clone().add(7, "day");
    const monthEnd = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .endOf("month");

    if (nextStart.isAfter(monthEnd)) return;
    setCurrentStartDate(nextStart);
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
        <View style={styles.weekNavigationContainer}>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              onPress={handlePrevWeek}
              style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
              disabled={!canGoPrev}
            >
              <ChevronLeft
                color={canGoPrev ? "#1F2937" : "#D1D5DB"}
                size={24}
              />
            </TouchableOpacity>

            <View style={styles.weekInfo}>
              <Text style={styles.weekNavigationText}>{weekRange}</Text>
              <Text style={styles.weekSubtext}>Tuần làm việc</Text>
            </View>

            <TouchableOpacity
              onPress={handleNextWeek}
              style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
              disabled={!canGoNext}
            >
              <ChevronRight
                color={canGoNext ? "#1F2937" : "#D1D5DB"}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bar Chart */}
        {currentWeekData && currentWeekData.length > 0 && (
          <View style={styles.section}>
            <SalaryBarChart
              data={currentWeekData}
              showSalary={showSalary}
              onToggleVisibility={() => setShowSalary(!showSalary)}
            />
          </View>
        )}

        {/* Daily List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
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
                    <View style={styles.dailyTopRow}>
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
    borderTopWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderTopColor: "#E5E7EB",
    marginBottom: 10,
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
    marginTop: 10,
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
  weekNavigationContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 10,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  navButtonDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.5,
  },
  weekInfo: {
    alignItems: "center",
    flex: 1,
  },
  weekNavigationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  weekSubtext: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Daily List
  dailyList: {
    gap: 12,
  },
  dailyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
