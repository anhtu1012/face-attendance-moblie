import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientProgressProps {
  progress: number; // between 0 and 1
  width?: number;
  height?: number;
  duration?: number;
}

export const GradientProgress = ({
  progress,
  width = 250,
  height = 12,
  duration = 500,
}: GradientProgressProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration,
      useNativeDriver: false, // animating width
    }).start();
  }, [progress]);

  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View style={{ width, height }}>
      {/* Background */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#e0e0e0", borderRadius: height / 2 },
        ]}
      />

      {/* Animated Gradient Fill */}
      <Animated.View
        style={{
          width: animatedWidth,
          height,
          borderRadius: height / 2,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};
