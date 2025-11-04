import CustomTabBar from "@/components/ui/CustomTabBar";
import DrawerScreenWrapper from "@/components/ui/DrawerScreenWrapper";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React, { memo, useCallback, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// import { useNotification } from '@/contexts/NotificationContext';

// Animated Tab Bar Icon component
interface TabBarIconProps {
  focused: boolean;
  name: string;
  color: string;
  size: number;
  iconType?: "AntDesign" | "MaterialIcons" | "Entypo";
  badgeCount?: number;
  index: number;
  code: string;
}

const TabBarIcon = memo(function TabBarIcon({
  focused,
  name,
  color,
  size,
  iconType = "AntDesign",
  badgeCount,
  index,
  code,
}: TabBarIconProps) {
  const height = useSharedValue(25);

  useEffect(() => {
    height.value = withSpring(focused ? 45 : 25, {
      damping: 12,
      stiffness: 150,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    transform: [
      {
        scale: withSpring(focused ? 1.15 : 1),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.tabBarIconContainer, animatedStyle]}>
      {iconType === "AntDesign" && name && (
        <AntDesign name={name as any} size={size} color={color} />
      )}
      {iconType === "MaterialIcons" && name && (
        <MaterialIcons name={name as any} size={size} color={color} />
      )}
      {iconType === "Entypo" && name && (
        <Entypo name={name as any} size={size} color={color} />
      )}
      {badgeCount != null && badgeCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            backgroundColor: "#FF4444",
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            {badgeCount > 99 ? "99+" : badgeCount.toString()}
          </Text>
        </View>
      )}
    </Animated.View>
  );
});

export default function TabLayout() {
  return (
    <DrawerScreenWrapper>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                focused={focused}
                name="home"
                color={color}
                size={size}
                index={0}
                code="to0"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(form)/choose-form"
          options={{
            title: "Tạo đơn",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                focused={focused}
                name="form"
                color={color}
                size={size}
                index={1}
                code="to1"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="timesheet-tab"
          options={{
            title: "Bảng công",
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                focused={focused}
                name="calendar"
                color={color}
                size={size}
                index={2}
                code="to2"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="salary"
          options={{
            title: "Bảng lương",
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                focused={focused}
                name="attach-money"
                color={color}
                size={size}
                iconType="MaterialIcons"
                index={3}
                code="to3"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="timekeep-camera"
          options={{
            href: null,
          }}
        />
        {/* Hide pages */}
        <Tabs.Screen
          name="(form)/create-form"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="(form)/form-detail"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="(form)/view-all-submitted-form"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/DependentInfo"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/ResumeInfo"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/WorkContractInfo"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/GeneralInfo"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </DrawerScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabBarIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
});
