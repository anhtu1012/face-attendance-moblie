import { CameraView } from "@/components/FaceRegistration/CameraView";
import { FaceGuideOverlay } from "@/components/FaceRegistration/FaceGuideOverlay";
import { InstructionText } from "@/components/FaceRegistration/InstructionText";
import { ProgressBar } from "@/components/FaceRegistration/ProgressBar";
import SpinnerOverlay from "@/components/SpinnerOverlay";
import AlertModal from "@/components/ui/AlertModal";
import { useFaceRegistration } from "@/hooks/useFaceRegistration";
import { Text, View } from "react-native";
import { useCameraDevice } from "react-native-vision-camera";
import { styles } from "./camera.styles";

const CameraPage = () => {
  const device = useCameraDevice("front");
  const {
    cameraRef,
    isFocused,
    ready,
    setReady,
    missingPose,
    isPending,
    modal,
    setModal,
    frameProcessor,
    handleCameraLayout,
    userFace,
  } = useFaceRegistration();
  return (
    <View style={styles.cameraWrapper} onLayout={() => setReady(true)}>
      <SpinnerOverlay visible={isPending} content="Đang upload ảnh..." />
      <AlertModal {...modal} />
      <Text style={styles.title}>Đăng ký khuôn mặt</Text>
      {ready && device && (
        <CameraView
          cameraRef={cameraRef}
          device={device}
          isFocused={isFocused}
          isPending={isPending}
          frameProcessor={frameProcessor}
          onLayout={handleCameraLayout}
          isDetectedFace={userFace}
        />
      )}
      {/* Face Detection Overlay */}
      <FaceGuideOverlay isDetectedFace={userFace} />
      <InstructionText missingPose={missingPose} isDetectedFace={userFace} />

      {/* Progress bar */}
      <ProgressBar missingPose={missingPose} />

      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        {/* Top Controls */}
        <View style={styles.topControls}></View>

        {/* Bottom Controls */}
        <View style={styles.shutterContainer}></View>
      </View>
    </View>
  );
};

export default CameraPage;
