import { useDrawerProgress } from "@react-navigation/drawer";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const DrawerScreenWrapper = ({ children }: { children: any }) => {
  const progress = useDrawerProgress(); // Shared value from drawer
  const distance = useSharedValue(0);

  useAnimatedReaction(
    () => progress.value,
    (currentProgress) => {
      if (currentProgress > 0.5) {
        distance.value = withSpring(1, {
          damping: 15,
          stiffness: 120,
        });
      } else {
        distance.value = 0;
      }
    },
  );

  // Animated style that reacts to drawer progress
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 0.75], "clamp"),
        },
        {
          translateX: interpolate(distance.value, [0, 1], [0, 9]),
        },
      ],
      borderRadius: interpolate(progress.value, [0, 1], [0, 30]),
      overflow: "hidden",
    };
  });

  const animatedBehindStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(distance.value, [0, 1], [25, 30]),
        },
      ],
    };
  });

  return (
    <>
      <Animated.View style={[styles.behindPage, animatedBehindStyle]} />
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </>
  );
};

export default DrawerScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3674B5",
  },
  behindPage: {
    position: "absolute",
    width: 250,
    height: "70%",
    top: "15%",
    backgroundColor: "#709ED4",
    transform: [{ translateX: 25 }],
    borderRadius: 30,
  },
});
