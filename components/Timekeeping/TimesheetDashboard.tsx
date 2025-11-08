import { useGetTimekeepingDashboardData } from "@/hooks/useGetTimekeepingDashboardData";
import { RootState } from "@/lib/store";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MonthPickerButton from "../ui/MonthPickerButton";
import MonthPickerModal from "../ui/MonthPickerModal";
import StatItem from "../ui/StatItem";

const TimesheetDashboard: React.FC = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userProfile.id);
  const { timekeepingDashboardData, refetch } = useGetTimekeepingDashboardData(
    userId!,
    selectedMonth
  );

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setShowMonthPicker(false);
    refetch();
  };

  const getMonthYearText = () => {
    return `T${selectedMonth}, ${selectedYear}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Month Selector */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thống kê {getMonthYearText()}</Text>
        <MonthPickerButton setShowMonthPicker={setShowMonthPicker} />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        {/* Công thực tế Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={28}
              color="#10B981"
            />
          </View>
          <Text style={styles.summaryLabel}>Công thực tế</Text>
          <Text style={styles.summaryValue}>
            {timekeepingDashboardData?.actualTimekeeping}
            <Text style={styles.summaryTotal}>
              /{timekeepingDashboardData?.monthStandardTimekeeping}
            </Text>
          </Text>
        </View>

        {/* Giờ làm thực tế Card */}
        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIconContainer,
              { backgroundColor: "#E0F2FE" },
            ]}
          >
            <Feather name="clock" size={28} color="#3B82F6" />
          </View>
          <Text style={styles.summaryLabel}>Giờ làm thực tế</Text>
          <Text style={styles.summaryValue}>
            {timekeepingDashboardData?.actualHour}
            <Text style={styles.summaryTotal}>
              /{timekeepingDashboardData?.monthStandardHour}
            </Text>
          </Text>
        </View>
      </View>

      {/* Công làm việc Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="briefcase" size={20} color="#10B981" />
          <Text style={styles.sectionTitle}>Công làm việc</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatItem
            label="Công làm việc"
            value={timekeepingDashboardData?.actualTimekeeping ?? 0}
            icon="briefcase"
            color="#10B981"
          />
          <StatItem
            label="Giờ làm việc thực tính"
            value={timekeepingDashboardData?.actualHour ?? 0}
            icon="clock"
            color="#10B981"
          />
          <StatItem
            label="Số công chuẩn"
            value={timekeepingDashboardData?.monthStandardTimekeeping ?? 0}
            icon="calendar"
            color="#6B7280"
          />
        </View>
      </View>

      {/* Vi phạm Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="warning" size={20} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Vi phạm</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatItem
            label="Số lần đi muộn"
            value={timekeepingDashboardData?.lateNumber ?? 0}
            icon="alert-circle"
            color="#EF4444"
            highlight={
              timekeepingDashboardData?.lateNumber &&
              timekeepingDashboardData?.lateNumber > 0
            }
          />
          <StatItem
            label="Số lần về sớm"
            value={timekeepingDashboardData?.earlyNumber ?? 0}
            icon="alert-circle"
            color="#F59E0B"
            highlight={
              timekeepingDashboardData?.earlyNumber &&
              timekeepingDashboardData?.earlyNumber > 0
            }
          />
          <StatItem
            label="Số công nghỉ không lý do"
            value={timekeepingDashboardData?.offWorkNumber ?? 0}
            icon="x-circle"
            color="#EF4444"
            highlight={
              timekeepingDashboardData?.offWorkNumber &&
              timekeepingDashboardData?.offWorkNumber > 0
            }
          />
          <StatItem
            label="Số lần quên check in/out"
            value={timekeepingDashboardData?.forgetLogNumber ?? 0}
            icon="alert-triangle"
            color="#F59E0B"
            highlight={
              timekeepingDashboardData?.forgetLogNumber &&
              timekeepingDashboardData?.forgetLogNumber > 0
            }
          />
        </View>
      </View>

      {/* Overtime Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="clock-plus-outline"
            size={20}
            color="#8B5CF6"
          />
          <Text style={styles.sectionTitle}>Làm thêm</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatItem
            label="Công làm thêm ngày thường"
            value={timekeepingDashboardData?.normalOtTimekeeping ?? 0}
            icon="plus-circle"
            color="#8B5CF6"
          />
          <StatItem
            label="Giờ làm thêm ngày thường"
            value={timekeepingDashboardData?.normalOtHour ?? 0}
            icon="clock"
            color="#8B5CF6"
            suffix="h"
          />
          <StatItem
            label="Công làm thêm ngày nghỉ"
            value={timekeepingDashboardData?.offDayOtTimekeeping ?? 0}
            icon="plus-circle"
            color="#EF4444"
          />
          <StatItem
            label="Giờ làm thêm ngày nghỉ"
            value={timekeepingDashboardData?.offDayOtHour ?? 0}
            icon="clock"
            color="#EF4444"
            suffix="h"
          />
          <StatItem
            label="Công làm thêm ngày lễ"
            value={timekeepingDashboardData?.holidayOtTimekeeping ?? 0}
            color="#F59E0B"
            icon="plus-circle"
          />
          <StatItem
            label="Giờ làm thêm ngày lễ"
            value={timekeepingDashboardData?.holidayOtHour ?? 0}
            icon="clock"
            color="#F59E0B"
            suffix="h"
          />
        </View>
      </View>

      {/* Phạt Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="money-off" size={20} color="#EF4444" />
          <Text style={styles.sectionTitle}>Phạt</Text>
        </View>

        <View style={styles.fineContainer}>
          <StatItem
            label="Tiền phạt quên check in/out"
            value={0}
            icon="alert-triangle"
            color="#EF4444"
            moneyValue={
              timekeepingDashboardData?.forgetLogFine?.toString() ?? ""
            }
          />
          <StatItem
            label="Tiền phạt chấm công"
            value={0}
            icon="clock"
            moneyValue={timekeepingDashboardData?.lateFine?.toString() ?? ""}
            color="#EF4444"
          />
        </View>
      </View>
      <MonthPickerModal
        showMonthPicker={showMonthPicker}
        setShowMonthPicker={setShowMonthPicker}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        handleMonthSelect={handleMonthSelect}
        currentDate={currentDate}
      />
    </ScrollView>
  );
};

export default TimesheetDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 15,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 10,
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginVertical: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: "600",
    color: "#9CA3AF",
  },

  // Section
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
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

  // Stats Grid
  statsGrid: {
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    minWidth: 40,
    textAlign: "right",
  },

  // Overtime Details
  overtimeDetails: {
    marginTop: 12,
    paddingTop: 12,
    gap: 10,
  },
  overtimeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  overtimeLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  overtimeValue: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 50,
    textAlign: "right",
  },

  // Fine Container
  fineContainer: {
    gap: 12,
  },
  fineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  fineLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  fineAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    minWidth: 80,
    textAlign: "right",
  },
});
