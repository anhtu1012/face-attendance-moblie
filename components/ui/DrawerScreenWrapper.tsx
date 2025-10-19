import { useDrawerProgress } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const DrawerScreenWrapper = ({ children }: { children: any }) => {
  const progress = useDrawerProgress(); // Shared value from drawer

  // Animated style that reacts to drawer progress
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 0.75], "clamp"),
        },
      ],
      borderRadius: interpolate(progress.value, [0, 1], [0, 30]),
      overflow: "hidden",
    };
  });

  return (
    <>
      <Animated.View style={styles.behindPage} />
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
