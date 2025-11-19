import { CameraView } from "@/components/FaceRegistration/CameraView";
import { FaceGuideOverlay } from "@/components/FaceRegistration/FaceGuideOverlay";
import { InstructionText } from "@/components/FaceRegistration/InstructionText";
import SpinnerOverlay from "@/components/SpinnerOverlay";
import AlertModal from "@/components/ui/AlertModal";
import { useFaceRegistration } from "@/hooks/useFaceRegistration";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { styles } from "./camera.styles";

const CameraPage = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("front");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

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
    currentPose,
    capturingPose, // Get the currently capturing pose
  } = useFaceRegistration();

  // Check and request camera permission
  useEffect(() => {
    const checkPermission = async () => {
      setIsCheckingPermission(true);

      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          setModal({
            visible: true,
            type: "error",
            title: "Quyền truy cập camera",
            message:
              "Vui lòng cấp quyền truy cập camera để sử dụng tính năng này",
            onClose: () => {
              setModal((prev) => ({ ...prev, visible: false }));
              router.replace({
                pathname: "/(drawer)/(tabs)",
                params: {
                  refetchForms: "true",
                  refetchUserData: "true",
                },
              });
            },
          });
        }
      }

      setIsCheckingPermission(false);
    };

    checkPermission();
  }, [hasPermission]);

  return (
    <View style={styles.cameraWrapper} onLayout={() => setReady(true)}>
      {/* Loading overlay */}
      <SpinnerOverlay visible={isPending} content="Đang upload ảnh..." />
      {/* Modal */}
      <AlertModal {...modal} />
      {/* Title */}
      <Text style={styles.title}>Đăng ký khuôn mặt</Text>

      {/* Permission or Camera Loading */}
      {isCheckingPermission || !hasPermission || !device ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3674B5" />
          <Text style={styles.loadingText}>
            {isCheckingPermission
              ? "Đang kiểm tra quyền truy cập..."
              : !hasPermission
                ? "Đang yêu cầu quyền truy cập camera..."
                : "Đang khởi tạo camera..."}
          </Text>
        </View>
      ) : (
        <>
          {/* Camera */}
          {ready && (
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
            currentMissingPose={capturingPose ?? missingPose[0]} // Use capturing pose if available, otherwise next pose
          />
          {/* Instruction Text */}
          <InstructionText
            missingPose={missingPose}
            isDetectedFace={userFace}
          />
        </>
      )}
    </View>
  );
};

export default CameraPage;
