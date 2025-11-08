import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Platform, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import CustomTabBarButton from "./CustomTabBarButton";

export const EXCLUDE_ROUTE = [
  "(form)/create-form",
  "(form)/form-detail",
  "(form)/view-all-submitted-form",
  "profile",
  "profile/DependentInfo",
  "profile/ResumeInfo",
  "profile/WorkContractInfo",
  "profile/GeneralInfo",
  "profile/AppendixTab",
  "timekeep-camera",
];

const ICON_SIZE = 22;
const icons = [
  (color: string) => <AntDesign name="home" size={ICON_SIZE} color={color} />,
  (color: string) => <AntDesign name="form" size={ICON_SIZE} color={color} />,
  (color: string) => (
    <AntDesign name="calendar" size={ICON_SIZE} color={color} />
  ),
  (color: string) => (
    <MaterialIcons name="attach-money" size={ICON_SIZE} color={color} />
  ),
];

// Safety: Use icons.length as the expected visible tab count
const EXPECTED_VISIBLE_TABS = icons.length;

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [dimensions, setDimensions] = useState({ height: 25, width: 100 });

  // Calculate the actual number of visible tabs
  const visibleTabsCount = state.routes.filter(
    (route) => !EXCLUDE_ROUTE.includes(route.name),
  ).length;

  // Safety: Use EXPECTED_VISIBLE_TABS if calculation doesn't match icons length
  const actualVisibleTabs =
    visibleTabsCount === EXPECTED_VISIBLE_TABS
      ? visibleTabsCount
      : EXPECTED_VISIBLE_TABS;

  // Debug logging (only in development)
  // if (__DEV__) {
  //   console.log("=== CustomTabBar Debug ===");
  //   console.log("Total routes:", state.routes.length);
  //   console.log("All routes:", state.routes.map((r) => r.name).join(", "));
  //   console.log("Calculated visible tabs:", visibleTabsCount);
  //   console.log("Expected visible tabs:", EXPECTED_VISIBLE_TABS);
  //   console.log("Using:", actualVisibleTabs);
  // }

  const buttonWidth = dimensions.width / actualVisibleTabs;

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    if (!EXCLUDE_ROUTE.includes(state.routeNames[state.index])) {
      // Calculate the actual tab index (excluding hidden routes)
      const actualTabIndex = state.routes
        .slice(0, state.index)
        .filter((r) => !EXCLUDE_ROUTE.includes(r.name)).length;

      tabPositionX.value = withSpring(buttonWidth * actualTabIndex, {
        damping: 80,
        stiffness: 1000,
      });
    }
  }, [state.index, buttonWidth]);

  const handleSetIsFocused = (
    route: NavigationRoute<ParamListBase, string>,
    index: number,
  ) => {
    if (!EXCLUDE_ROUTE.includes(state.routeNames[state.index]))
      return state.index === index;

    return false;
  };

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <LinearGradient
      colors={["#ffffff", "#ffffff"]}
      style={styles.tabbar}
      onLayout={onTabbarLayout}
    >
      {!EXCLUDE_ROUTE.includes(state.routeNames[state.index]) && (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              backgroundColor: "#3674B5",
              borderRadius: 30,
              left: 17,
              height: dimensions.height - 10,
              width: buttonWidth - 34,
            },
          ]}
        />
      )}
      {state.routes.map((route, index) => {
        if (EXCLUDE_ROUTE.includes(route.name)) return null;

        // Calculate the actual tab index (excluding hidden routes)
        const tabIndex = state.routes
          .slice(0, index)
          .filter((r) => !EXCLUDE_ROUTE.includes(r.name)).length;

        // Safety check: skip if tabIndex is out of bounds
        if (tabIndex >= icons.length) {
          return null;
        }

        const { options } = descriptors[route.key];
        const label = options.title;
        const isFocused = handleSetIsFocused(route, index);

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <CustomTabBarButton
            key={index}
            index={tabIndex}
            icons={icons}
            onPress={onPress}
            label={label}
            isFocused={isFocused}
          />
        );
      })}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginHorizontal: 20,
    paddingVertical: 10,
    // borderRadius: 35,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,

    // Android Elevation
    elevation: 40,

    // Optional: Add subtle border to separate from background
    borderWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 0.5,
    borderBottomWidth: 0,
    borderColor: "#e5e5e5",
  },
});

export default CustomTabBar;
