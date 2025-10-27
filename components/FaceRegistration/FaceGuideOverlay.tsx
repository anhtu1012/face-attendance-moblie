import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { FaceGuide, styles } from "./FaceGuideoverlay.styles";
import SegmentedCircle from "./SegmentedCircle";

interface FaceGuideOverlayType {
  isDetectedFace: boolean;
}

export const FaceGuideOverlay = ({ isDetectedFace }: FaceGuideOverlayType) => {
  const isFocused = useIsFocused();
  const [animationsFinished, setAnimationsFinished] = useState(false);
  const translateTL = { x: useSharedValue(0), y: useSharedValue(0) };
  const translateTR = { x: useSharedValue(0), y: useSharedValue(0) };
  const translateBL = { x: useSharedValue(0), y: useSharedValue(0) };
  const translateBR = { x: useSharedValue(0), y: useSharedValue(0) };
  const circle = useSharedValue(0);

  // Handle border radius animation when face is detected
  useEffect(() => {
    if (isDetectedFace) {
      circle.value = withTiming(
        1,
        {
          duration: 500,
        },
        (finished) => {
          if (finished) {
            runOnJS(setAnimationsFinished)(true);
          }
        },
      );
      // Stop all translate animations when face is detected
      translateTL.x.value = withTiming(0, { duration: 300 });
      translateTL.y.value = withTiming(0, { duration: 300 });
      translateTR.x.value = withTiming(0, { duration: 300 });
      translateTR.y.value = withTiming(0, { duration: 300 });
      translateBL.x.value = withTiming(0, { duration: 300 });
      translateBL.y.value = withTiming(0, { duration: 300 });
      translateBR.x.value = withTiming(0, { duration: 300 });
      translateBR.y.value = withTiming(0, { duration: 300 });
    } else {
      setAnimationsFinished(false);
      circle.value = withTiming(0, {
        duration: 500,
      });
    }
  }, [isDetectedFace]);

  useEffect(() => {
    if (!isFocused || isDetectedFace) return;

    // Wait 1 second before starting animations
    const timer = setTimeout(() => {
      // Top Left (-X, -Y)
      translateTL.x.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      translateTL.y.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      // Top Right (+X, -Y)
      translateTR.x.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      translateTR.y.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      // Bottom Left (-X, +Y)
      translateBL.x.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      translateBL.y.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      // Bottom Right (+X, +Y)
      translateBR.x.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );

      translateBR.y.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 400 }),
          withTiming(0, { duration: 400 }),
          withDelay(1500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );
    }, 1000); // Wait 1 second before starting animations

    return () => {
      clearTimeout(timer);
    };
  }, [isFocused, isDetectedFace]);

  const animTL = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateTL.x.value },
      { translateY: translateTL.y.value },
    ],
  }));
  const animTR = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateTR.x.value },
      { translateY: translateTR.y.value },
    ],
  }));
  const animBL = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateBL.x.value },
      { translateY: translateBL.y.value },
    ],
  }));
  const animBR = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateBR.x.value },
      { translateY: translateBR.y.value },
    ],
  }));

  // Calculate border radius: from FaceGuide.radius (15) to 50% of width/height (20)

  const maxRadius = 100;
  const animBorderRadiusTL = useAnimatedStyle(() => {
    const borderTopLeftRadiusValue = interpolate(
      circle.value,
      [0, 1],
      [FaceGuide.radius, maxRadius],
    );
    return {
      borderTopLeftRadius: `${borderTopLeftRadiusValue}%`,
    };
  });

  const animBorderRadiusTR = useAnimatedStyle(() => {
    const borderTopRightRadiusValue = interpolate(
      circle.value,
      [0, 1],
      [FaceGuide.radius, maxRadius],
    );
    return {
      borderTopRightRadius: `${borderTopRightRadiusValue}%`,
    };
  });

  const animBorderRadiusBL = useAnimatedStyle(() => {
    const borderBottomLeftRadiusValue = interpolate(
      circle.value,
      [0, 1],
      [FaceGuide.radius, maxRadius],
    );
    return {
      borderBottomLeftRadius: `${borderBottomLeftRadiusValue}%`,
    };
  });

  const animBorderRadiusBR = useAnimatedStyle(() => {
    const borderBottomRightRadiusValue = interpolate(
      circle.value,
      [0, 1],
      [FaceGuide.radius, maxRadius],
    );
    return {
      borderBottomRightRadius: `${borderBottomRightRadiusValue}%`,
    };
  });

  const animSizeCorner = useAnimatedStyle(() => ({
    width: interpolate(circle.value, [0, 1], [FaceGuide.width, 110]),
    height: interpolate(circle.value, [0, 1], [FaceGuide.height, 113]),
  }));
  const animBorderStyle = useAnimatedStyle(() => ({
    borderColor: isDetectedFace ? "#a5a1a2" : FaceGuide.color,
    borderStyle: isDetectedFace ? "dashed" : "solid",
    opacity: animationsFinished ? 0 : 1,
  }));

  return (
    <View style={styles.overlay}>
      {/* Face Detection Guide */}
      {isDetectedFace && animationsFinished && <SegmentedCircle />}
      <View style={styles.faceGuideContainer}>
        <View style={styles.faceGuide}>
          <Animated.View
            style={[
              styles.cornerTopLeft,
              animTL,
              animBorderRadiusTL,
              animSizeCorner,
              animBorderStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.cornerTopRight,
              animTR,
              animBorderRadiusTR,
              animSizeCorner,
              animBorderStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.cornerBottomLeft,
              animBL,
              animBorderRadiusBL,
              animSizeCorner,
              animBorderStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.cornerBottomRight,
              animBR,
              animBorderRadiusBR,
              animSizeCorner,
              animBorderStyle,
            ]}
          />
        </View>
      </View>
    </View>
  );
};
