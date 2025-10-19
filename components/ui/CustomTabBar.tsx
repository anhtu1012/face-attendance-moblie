import { StyleSheet, View, Platform, LayoutChangeEvent } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBarButton from "./CustomTabBarButton";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const EXCLUDE_ROUTE = [
  "(form)/create-form",
  "(form)/form-detail",
  "(form)/view-all-submitted-form",
  "profile",
  "profile/DependentInfo",
  "profile/ResumeInfo",
  "profile/WorkContractInfo",
  "profile/GeneralInfo",
  "menu-tab",
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
  (color: string) => <Entypo name="menu" size={ICON_SIZE} color={color} />,
];

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [dimensions, setDimensions] = useState({ height: 25, width: 100 });

  const buttonWidth =
    dimensions.width / (state.routes.length - EXCLUDE_ROUTE.length);

  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, {
      damping: 80,
      stiffness: 1000,
    });
  }, [state.index]);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

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
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: "#3674B5",
            borderRadius: 30,
            marginHorizontal: 17,
            height: dimensions.height - 10,
            width: buttonWidth - 35,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        if (EXCLUDE_ROUTE.includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label = options.title;
        const isFocused = state.index === index;

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
            index={index}
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
    borderColor: "#e5e5e5",
  },
});

export default CustomTabBar;
