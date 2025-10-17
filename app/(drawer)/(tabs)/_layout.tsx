import CustomTabBar from "@/components/ui/CustomTabBar";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { MotiView, useAnimationState, useDynamicAnimation } from "moti";
import React, { memo, useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

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
  // const { notificationCount } = useNotification();
  const notificationCount = 0; // Temporary placeholder
  const navigation = useNavigation();

  const renderMenuButton = useCallback(
    (props: any) => (
      <TouchableOpacity
        {...props}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TabBarIcon
          focused={false}
          name="menu"
          color="#888"
          size={24}
          iconType="Entypo"
          badgeCount={notificationCount}
          index={4}
          code="to4"
        />
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "500",
            marginTop: 3,
          }}
        >
          Menu
        </Text>
      </TouchableOpacity>
    ),
    [navigation, notificationCount],
  );

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3674B5",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingBottom: 5,
          height: 65,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          bottom: 0,
          zIndex: 8,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 3,
          marginBottom: 5,
          fontWeight: "500",
        },
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
          // tabBarButton: (props) => {
          //   const { onPress, ...touchableProps } = props;
          //   return (
          //     <TouchableOpacity
          //       style={touchableProps.style}
          //       accessibilityState={touchableProps.accessibilityState}
          //       accessibilityLabel={touchableProps.accessibilityLabel}
          //       testID={touchableProps.testID}
          //       onPress={() => {
          //         router.push("/timesheet" as any);
          //       }}
          //     >
          //       {props.children}
          //     </TouchableOpacity>
          //   );
          // },
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
        name="menu-tab"
        options={{
          title: "Menu",
          tabBarButton: renderMenuButton,
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
          title: "Thông tin nhân sự",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/DependentInfo"
        options={{
          title: "Người phụ thuộc",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/ResumeInfo"
        options={{
          title: "Sơ yếu lý lịch",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/WorkContractInfo"
        options={{
          title: "Hợp đồng",
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/GeneralInfo"
        options={{
          title: "Thông tin chung",
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
});
