import { CameraView } from "@/components/FaceRegistration/CameraView";
import { FaceGuideOverlay } from "@/components/FaceRegistration/FaceGuideOverlay";
import SpinnerOverlay from "@/components/SpinnerOverlay";
import AlertModal from "@/components/ui/AlertModal";
import { useTimekeep } from "@/hooks/useTimekeep";
import { dtoPutTimekeep } from "@/models/timesheet/dtoTimekeep";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCameraDevice } from "react-native-vision-camera";

const TimekeepCameraPage = () => {
  const device = useCameraDevice("front");
  const { mode, timekeepingId } = useLocalSearchParams<{
    mode: "check-in" | "check-out";
    timekeepingId: string;
  }>();

  // Use the timekeep hook with custom handler
  const handleCaptureAndTimekeep = useCallback(
    async (imagePath: string) => {
      try {
        setIsPending(true);

        // Prepare timekeep data based on mode
        const currentTime = new Date().toISOString();

        const timekeepData: dtoPutTimekeep = {};

        if (mode === "check-in") {
          timekeepData.checkInTime = currentTime;
        } else if (mode === "check-out") {
          timekeepData.checkOutTime = currentTime;
        }

        // Call timekeep API
        // const response = await timkeep(timekeepData, timekeepingId);
        //
        // if (response.status === 200 || response.status === 201) {
        //   setModal({
        //     visible: true,
        //     type: "success",
        //     title: "Thành công",
        //     message:
        //       mode === "check-in"
        //         ? "Chấm công vào thành công!"
        //         : "Chấm công ra thành công!",
        //     onClose: () => {
        //       setModal((prev) => ({ ...prev, visible: false }));
        //       router.back();
        //     },
        //   });
        // } else {
        //   throw new Error("Chấm công thất bại");
        // }
      } catch (error: any) {
        console.error("Timekeep error:", error);
        setModal({
          visible: true,
          type: "error",
          title: "Lỗi",
          message: error?.message || "Có lỗi xảy ra khi chấm công",
          onClose: () => setModal((prev) => ({ ...prev, visible: false })),
        });
      } finally {
        setIsPending(false);
      }
    },
    [mode, timekeepingId],
  );

  const {
    cameraRef,
    isFocused,
    ready,
    isPending,
    modal,
    userFace,
    setReady,
    setModal,
    setIsPending,
    frameProcessor,
    handleCameraLayout,
    isDetectedFace,
  } = useTimekeep({
    onCapture: handleCaptureAndTimekeep,
    autoCapture: true, // Automatically capture when face is detected
  });

  return (
    <View style={styles.cameraWrapper} onLayout={() => setReady(true)}>
      {/* Loading overlay */}
      <SpinnerOverlay visible={isPending} content="Đang xử lý chấm công..." />

      {/* Modal */}
      <AlertModal {...modal} />

      {/* Title */}
      <Text style={styles.title}>
        {mode === "check-in" ? "Chấm công vào" : "Chấm công ra"}
      </Text>

      {/* Camera */}
      {ready && device && (
        <CameraView
          cameraRef={cameraRef}
          device={device}
          isFocused={isFocused}
          isPending={isPending}
          frameProcessor={frameProcessor}
          onLayout={handleCameraLayout}
          isDetectedFace={isDetectedFace}
        />
      )}

      {/* Face Detection Overlay - WITHOUT pose checking */}
      <FaceGuideOverlay
        isDetectedFace={isDetectedFace}
        currentPose={null}
        currentMissingPose={undefined}
      />

      {/* Instruction Text */}
      <View style={styles.textContainer}>
        {!isDetectedFace ? (
          <Text style={styles.modernInstructionText}>
            Vui lòng đưa khuôn mặt vào khung hình
          </Text>
        ) : (
          <Text style={styles.modernInstructionText}>
            Đã phát hiện khuôn mặt! Đang xử lý...
          </Text>
        )}
      </View>
    </View>
  );
};

export default TimekeepCameraPage;

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
    backgroundColor: "#fffeff",
  },
  title: {
    color: "#000",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: "15%",
    marginBottom: "5%",
  },
  textContainer: {
    marginTop: 30,
  },
  modernInstructionText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: "10%",
  },
});
