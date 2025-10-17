import { PlatformPressable, Text } from "@react-navigation/elements";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const CustomTabBarButton = ({
  icons,
  index,
  onPress,
  label,
  isFocused,
}: any) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused == "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 700 },
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });

  return (
    <PlatformPressable key={index} onPress={onPress} style={styles.tabbarItem}>
      <Animated.Text style={animatedIconStyle}>
        {icons[index](isFocused ? "#fff" : "#888")}
      </Animated.Text>
      <Animated.Text
        style={[
          {
            color: isFocused ? "#fff" : "#888",
            fontSize: 10,
            fontWeight: "bold",
            opacity: isFocused ? 0 : 1,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </PlatformPressable>
  );
};

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});

export default CustomTabBarButton;
