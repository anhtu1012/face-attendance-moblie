import { CameraView } from "@/components/FaceRegistration/CameraView";
import { FaceGuideOverlay } from "@/components/FaceRegistration/FaceGuideOverlay";
import { InstructionText } from "@/components/FaceRegistration/InstructionText";
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
    frameProcessor,
    handleCameraLayout,
    userFace,
    currentPose,
  } = useFaceRegistration();
  return (
    <View style={styles.cameraWrapper} onLayout={() => setReady(true)}>
      {/* Loading overlay */}
      <SpinnerOverlay visible={isPending} content="Đang upload ảnh..." />
      {/* Modal */}
      <AlertModal {...modal} />
      {/* Title */}
      <Text style={styles.title}>Đăng ký khuôn mặt</Text>
      {/* Camera */}
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
      <FaceGuideOverlay
        isDetectedFace={userFace}
        currentPose={currentPose}
        currentMissingPose={missingPose[0]}
      />
      {/* Instruction Text */}
      <InstructionText missingPose={missingPose} isDetectedFace={userFace} />
    </View>
  );
};

export default CameraPage;
