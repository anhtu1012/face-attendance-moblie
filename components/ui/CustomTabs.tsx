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
  isBorderedBottom?: boolean;
}

const CustomTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  activeColor = "#3674B5", // Default màu xanh dương
  inactiveColor = "#6B7280", // Default màu xám
  isBorderedBottom = true,
}: TabProps) => {
  return (
    <View
      style={[
        styles.tabContainer,
        isBorderedBottom && {
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        },
      ]}
    >
      <View style={styles.tabsBackground}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
          decelerationRate="fast"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  isActive && {
                    backgroundColor: activeColor,
                  },
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                {tab.icon && (
                  <Feather
                    name={tab.icon as any}
                    size={16}
                    color={isActive ? "#FFFFFF" : inactiveColor}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  style={[
                    styles.tabButtonText,
                    isActive
                      ? {
                          color: "#FFFFFF",
                          fontWeight: "700",
                        }
                      : { color: inactiveColor, fontWeight: "500" },
                  ]}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "transparent",
  },
  tabsBackground: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 4,
  },
  tabScrollContent: {
    alignItems: "center",
    gap: 6,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    backgroundColor: "transparent",
  },
  tabButtonText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CustomTabs;
