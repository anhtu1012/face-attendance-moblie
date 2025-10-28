import CustomHeaders from "@/components/ui/CustomHeaders";
import CustomTabs from "@/components/ui/CustomTabs";
import TimesheetCalendar from "@/components/ui/TimesheetCalendar";
import TimesheetWeek from "@/components/ui/TimesheetWeek";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
export default function TimesheetTabPlaceholder() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, title: "Công tháng", icon: "calendar" },
    { id: 1, title: "Công tuần", icon: "clock" },
    { id: 2, title: "Thống kê", icon: "bar-chart-2" },
  ];
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  customHeader: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3674B5",
  },
  scrollViewContainer: {
    flex: 1,
    paddingBottom: 400,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 10,
    paddingBottom: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

