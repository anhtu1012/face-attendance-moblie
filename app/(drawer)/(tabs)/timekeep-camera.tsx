import { CameraView } from "@/components/FaceRegistration/CameraView";
import { FaceGuideOverlay } from "@/components/FaceRegistration/FaceGuideOverlay";
import SpinnerOverlay from "@/components/SpinnerOverlay";
import AlertModal from "@/components/ui/AlertModal";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { useTimekeep } from "@/hooks/useTimekeep";
import { dtoPutTimekeep } from "@/models/timesheet/dtoTimekeep";
import { verifyFace } from "@/services/face/api";
import { timkeep } from "@/services/timesheet/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

const TimekeepCameraPage = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("front");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const { mode, timekeepingId } = useLocalSearchParams<{
    mode: "check-in" | "check-out";
    timekeepingId: string;
  }>();
  const { userId } = useGetUserProfile();

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
                  refetchCurrentTimekeeping: "true",
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

        // Check for spoofing
        const formData = new FormData();
        formData.append("userId", userId ?? "");
        formData.append("comparedImg", {
          uri: imagePath,
          type: "application/jpeg",
          name: "face.jpg",
        } as any);
        const verifyResultRes = await verifyFace(formData);
        if (verifyResultRes.status !== 200 && verifyResultRes.status !== 201) {
          throw new Error("Chấm công thất bại");
        }

        // Call timekeep API
        const timekeepRes = await timkeep(timekeepData, timekeepingId);

        if (timekeepRes.status === 200 || timekeepRes.status === 201) {
          setModal({
            visible: true,
            type: "success",
            title: "Thành công",
            message:
              mode === "check-in"
                ? "Chấm công vào thành công!"
                : "Chấm công ra thành công!",
            onClose: () => {
              setModal((prev) => ({ ...prev, visible: false }));
              router.replace({
                pathname: "/(drawer)/(tabs)",
                params: {
                  refetchCurrentTimekeeping: "true",
                },
              });
            },
          });
        } else {
          throw new Error("Chấm công thất bại");
        }
      } catch (error: any) {
        setModal({
          visible: true,
          type: "error",
          title: "Lỗi",
          message:
            error?.response.data.message || "Có lỗi xảy ra khi chấm công",
          onClose: () => {
            setModal((prev) => ({ ...prev, visible: false }));
            router.replace({
              pathname: "/(drawer)/(tabs)",
              params: {
                refetchCurrentTimekeeping: "true",
              },
            });
          },
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
    imagePath,
  } = useTimekeep({
    onCapture: handleCaptureAndTimekeep,
    autoCapture: true, // Automatically capture when face is detected
  });

  const handleShowTitle = () => {
    if (!isDetectedFace && !userFace) {
      return "Vui lòng đưa khuôn mặt ra xa camera để bắt đầu chấm công";
    } else if (isDetectedFace && userFace && userFace.length === 1) {
      return "Đã phát hiện khuôn mặt! Đang xử lý...";
    } else if (isDetectedFace && userFace && userFace.length > 1) {
      return "Không thể có nhiều khuôn mặt trong một khung hình";
    } else if (
      isDetectedFace &&
      userFace &&
      userFace.length === 1 &&
      userFace[0].bounds.height > 135 &&
      userFace[0].bounds.width > 135
    ) {
      return "Hãy để camera ra xa hơn nữa";
    }
  };

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
            <Text style={styles.modernInstructionText}>
              {handleShowTitle()}
            </Text>
          </View>
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
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
