import SalaryHistory from "@/components/Salary/SalaryHistory";
import SalaryOverview from "@/components/Salary/SalaryOverview";
import CustomTabs from "@/components/ui/CustomTabs";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SalaryPage() {
  const [activeTab, setActiveTab] = useState(0);
  const userId = 13;

  const tabs = [
    { id: 0, title: "Tổng quan", icon: "wallet" },
    { id: 1, title: "Lịch sử", icon: "list" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <SalaryOverview userId={userId} />;
      case 1:
        return <SalaryHistory userId={userId} />;
      default:
        return <SalaryOverview userId={userId} />;
    }
  };

  return (
    <View style={styles.container}>
      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeColor="#10B981"
        inactiveColor="#6B7280"
      />
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
