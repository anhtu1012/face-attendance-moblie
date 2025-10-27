import { useIsFocused } from "@react-navigation/native";
import { RefObject, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Camera, CameraDevice } from "react-native-vision-camera";

interface CameraViewProps {
  cameraRef: RefObject<Camera | null>;
  device: CameraDevice;
  isFocused: boolean;
  isPending: boolean;
  frameProcessor: any;
  onLayout: (e: any) => void;
  isDetectedFace: boolean;
}

export const CameraView = ({
  cameraRef,
  device,
  isFocused,
  isPending,
  frameProcessor,
  onLayout,
  isDetectedFace,
}: CameraViewProps) => {
  const circle = useSharedValue(0);
  useEffect(() => {
    if (isDetectedFace)
      circle.value = withSpring(1, {
        damping: 100,
        stiffness: 500,
      });
    else
      circle.value = withSpring(0, {
        damping: 100,
        stiffness: 500,
      });
  }, [isDetectedFace]);

  const animRound = useAnimatedStyle(() => {
    const heightValue = interpolate(circle.value, [0, 1], [55, 29]);
    const widthValue = interpolate(circle.value, [0, 1], [90, 57]);
    const marginTopValue = interpolate(circle.value, [0, 1], [0, 26]);
    const borderRadiusValue = interpolate(circle.value, [0, 1], [10, 50]);
    return {
      height: `${heightValue}%`,
      width: `${widthValue}%`,
      marginTop: `${marginTopValue}%`,
      borderRadius: `${borderRadiusValue}%`,
    };
  });
  return (
    <Animated.View style={[styles.camera, animRound]}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isPending ? !isPending : isFocused}
        frameProcessor={isFocused ? frameProcessor : undefined}
        photo={true}
        isMirrored={false}
        onLayout={onLayout}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  camera: {
    height: "55%",
    width: "90%",
    marginHorizontal: "auto",
    borderRadius: "",
    overflow: "hidden",
  },
});
