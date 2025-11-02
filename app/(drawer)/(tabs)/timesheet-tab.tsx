import TimesheetCalendar from "@/components/Timekeeping/TimesheetCalendar";
import TimesheetDashboard from "@/components/Timekeeping/TimesheetDashboard";
import TimesheetWeek from "@/components/Timekeeping/TimesheetWeek";
import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import { tabs } from "@/constants/timesheet";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./timesheet-tab.styles";
export default function TimesheetTabPlaceholder() {
  const [activeTab, setActiveTab] = useState(0);
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <TimesheetCalendar />;
      case 1:
        return <TimesheetWeek />;
      case 2:
        return <TimesheetDashboard />;
      default:
        return <TimesheetCalendar />;
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeaders
        title="Bảng chấm công"
        onBack={() => router.navigate("/(drawer)/(tabs)")}
      />
      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inactiveColor="#6B7280"
      />
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
    </View>
  );
}
