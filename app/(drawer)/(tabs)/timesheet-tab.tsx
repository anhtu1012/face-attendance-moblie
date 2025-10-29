import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import TimesheetCalendar from "@/components/ui/TimesheetCalendar";
import TimesheetWeek from "@/components/ui/TimesheetWeek";
import { tabs } from "@/constants/timesheet";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
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
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Thống kê</Text>
          </View>
        );
      default:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Công tháng</Text>
          </View>
        );
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
      />
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
    </View>
  );
}
