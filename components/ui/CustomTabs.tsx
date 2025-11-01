import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TabProps {
  tabs: {
    id: number;
    title: string;
    icon?: string;
  }[];
  activeTab: number;
  setActiveTab: (tab: number) => void;
  activeColor?: string; // Màu cho tab active
  inactiveColor?: string; // Màu cho tab inactive
}
const CustomTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  activeColor = "#3674B5", // Default màu xanh dương
  inactiveColor = "#666", // Default màu xám
}: TabProps) => {
  return (
    <View style={styles.tabContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
        decelerationRate="fast"
        snapToInterval={120}
        snapToAlignment="start"
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <Feather
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.id ? activeColor : inactiveColor}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.id && {
                  color: activeColor,
                  fontWeight: "600",
                },
                activeTab !== tab.id && { color: inactiveColor },
              ]}
            >
              {tab.title}
            </Text>
            {activeTab === tab.id && (
              <View
                style={[
                  styles.activeTabIndicator,
                  { backgroundColor: activeColor },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 40, // Extra space to indicate scrollable
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    position: "relative",
    minWidth: 80, // Reduced minimum width
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    // No background color for active state
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
  },
});
export default CustomTabs;
