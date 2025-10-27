import { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import { Camera, CameraDevice } from "react-native-vision-camera";

interface CameraViewProps {
  cameraRef: RefObject<Camera | null>;
  device: CameraDevice;
  isFocused: boolean;
  isPending: boolean;
  frameProcessor: any;
  onLayout: (e: any) => void;
}

export const CameraView = ({
  cameraRef,
  device,
  isFocused,
  isPending,
  frameProcessor,
  onLayout,
}: CameraViewProps) => {
  return (
    <View style={styles.camera}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    height: "50%",
    width: "90%",
    marginHorizontal: "auto",
    borderRadius: 25,
    overflow: "hidden",
  },
});
