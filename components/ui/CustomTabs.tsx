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
    icon: string;
  }[];
  activeTab: number;
  setActiveTab: (tab: number) => void;
}
const CustomTabs = ({ tabs, activeTab, setActiveTab }: TabProps) => {
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
                color={activeTab === tab.id ? "#3674B5" : "#666"}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.id && styles.activeTabButtonText,
              ]}
            >
              {tab.title}
            </Text>
            {activeTab === tab.id && <View style={styles.activeTabIndicator} />}
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
    paddingBottom: 2,
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
  activeTabButtonText: {
    color: "#3674B5",
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: "#3674B5",
    borderRadius: 1,
  },
});
export default CustomTabs;
