import SalaryHistory from "@/components/Salary/SalaryHistory";
import SalaryOverview from "@/components/Salary/SalaryOverview";
import YearlySalaryView from "@/components/Salary/YearlySalaryView";
import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import MonthPickerButton from "@/components/ui/MonthPickerButton";
import MonthPickerModal from "@/components/ui/MonthPickerModal";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SalaryPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { userId } = useGetUserProfile();
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const tabs = [
    { id: 0, title: "Tổng quan", icon: "pie-chart" },
    { id: 1, title: "Theo tháng", icon: "bar-chart" },
    { id: 2, title: "Theo năm", icon: "calendar" },
  ];
  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const getDateRange = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1, 6, 59, 59);
    const endDate = new Date(year, month, 0, 30, 59, 59);
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);

    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
  };
  const { startTime, endTime } = getDateRange(selectedYear, selectedMonth);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <SalaryOverview
            userId={userId || ""}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
      case 1:
        return (
          <SalaryHistory
            userId={userId || ""}
            fromDate={startTime}
            toDate={endTime}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
      case 2:
        return (
          <YearlySalaryView
            userId={userId || ""}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        );
      default:
        return (
          <SalaryOverview
            userId={userId || ""}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeaders
        title="Bảng lương"
        onBack={() => router.navigate("/(drawer)/(tabs)")}
      />
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            inactiveColor="#6B7280"
            isBorderedBottom={false}
          />
        </View>
        {activeTab !== 2 && (
          <View style={styles.pickerWrapper}>
            <MonthPickerButton setShowMonthPicker={setShowMonthPicker} />
          </View>
        )}
      </View>
      {renderTabContent()}
      <MonthPickerModal
        showMonthPicker={showMonthPicker}
        setShowMonthPicker={setShowMonthPicker}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        handleMonthSelect={handleMonthSelect}
        currentDate={currentDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tabsWrapper: {
    flex: 1,
  },
  pickerWrapper: {
    marginLeft: 12,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  monthSelectorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
