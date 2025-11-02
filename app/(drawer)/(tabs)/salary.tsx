import SalaryHistory from "@/components/Salary/SalaryHistory";
import SalaryOverview from "@/components/Salary/SalaryOverview";
import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import MonthPickerButton from "@/components/ui/MonthPickerButton";
import MonthPickerModal from "@/components/ui/MonthPickerModal";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SalaryPage() {
  const [activeTab, setActiveTab] = useState(0);
  const userId = 13;
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const tabs = [
    { id: 0, title: "Tổng quan", icon: "pie-chart" },
    { id: 1, title: "Lịch sử", icon: "bar-chart" },
  ];
  const getDateRange = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      startTime: startDate.toISOString().split("T")[0],
      endTime: endDate.toISOString().split("T")[0],
    };
  };
  const { startTime, endTime } = getDateRange(selectedYear, selectedMonth);
  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <SalaryOverview
            userId={userId}
            startTime={startTime}
            endTime={endTime}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
      case 1:
        return (
          <SalaryHistory
            userId={userId}
            startTime={startTime}
            endTime={endTime}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        );
      default:
        return (
          <SalaryOverview
            userId={userId}
            startTime={startTime}
            endTime={endTime}
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          inactiveColor="#6B7280"
          isBorderedBottom={false}
        />

        <MonthPickerButton setShowMonthPicker={setShowMonthPicker} />
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
