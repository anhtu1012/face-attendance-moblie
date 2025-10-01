import { CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Text, StyleSheet, View } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMissingPose, registerFace } from "@/services/face/api";
import { Pose } from "@/constants/face";
import { useIsFocused } from "@react-navigation/native";
import { GradientProgress } from "@/components/ui/GradientProgress";
import {
  Camera,
  runAsync,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";
import { classify_pose } from "@/utils/faceRecognitionUtils";

const FaceGuide = {
  width: 30,
  height: 30,
  top: 125,
  bottom: -60,
  horizontal: 10,
  borderVerticalWidth: 3,
  borderHorizontalWidth: 3,
  radius: 20,
  color: "#fefcfb",
};

const CameraPage = () => {
  const ref = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const [userProfile, setUserProfile] = useState<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cornerAnim = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);
  const [missingPose, setMissingPose] = useState<any[]>([]);
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    // detection options
  }).current;
  const device = useCameraDevice("front");
  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    return () => {
      // you must call `stopListeners` when current component is unmounted
      stopListeners();
    };
  }, []);

  useEffect(() => {
    if (!device) {
      // you must call `stopListeners` when `Camera` component is unmounted
      stopListeners();
      return;
    }

    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log({ status });
    })();
  }, [device]);

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    const face = faces[0];
    if (faces.length > 1) console.log("Multiple faces detected");
    else {
      console.log(
        face
          ? classify_pose(face.yawAngle, face.pitchAngle)
          : "No face detected",
      );
    }
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      runAsync(frame, () => {
        "worklet";
        const faces = detectFaces(frame);
        // ... chain some asynchronous frame processor
        // ... do something asynchronously with frame
        handleDetectedFaces(faces);
      });
      // ... chain frame processors
      // ... do something with frame
    },
    [handleDetectedFaces],
  );

  useEffect(() => {
    const getUserProfile = async () => {
      let userDataStr = await AsyncStorage.getItem("userProfile");

      if (userDataStr) {
        const user = JSON.parse(userDataStr);

        let missingPoseRes = await getMissingPose(user.id);

        setMissingPose(missingPoseRes.data.missingPose);

        setUserProfile(user);
      }
    };

    if (isFocused) getUserProfile();
  }, [isFocused]);

  const takePicture = async () => {
    const result = await handleBiometricAuth();
    if (result) {
      const photo = await ref.current?.takePictureAsync();
      console.log("uri: ", photo?.uri);
      console.log("userId: ", userProfile.id);
      console.log("chekcedPose: ", missingPose[0]);

      const faceFormData = new FormData();
      faceFormData.append("userId", userProfile.id);
      faceFormData.append("img", {
        uri: photo!.uri,
        type: "image/jpeg",
        name: "face.jpg",
      } as any);
      faceFormData.append("checkedPose", missingPose[0]);

      // register user's face
      try {
        await registerFace(faceFormData);

        // remove first pose in missingPose array
        setMissingPose((prev) => prev.slice(1));
      } catch (error: any) {
        Alert.alert(
          "Không thể đăng ký khuôn mặt",
          error.response?.data?.message ?? "Lỗi không xác định",
          [{ text: "Chụp lại", style: "cancel" }],
        );

        console.log(error);

        console.log(error.response?.data?.message);
      }
    }
  };

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isBiometricAvailable) {
      Alert.alert(
        "Thiết bị không hỗ trợ vân tay",
        "Vui lòng dùng thiết bị khác để xác nhận vân tay",
        [{ text: "Quay về trang chủ", onPress: () => router.navigate("/") }],
      );
    }

    let supportedBiometrics;
    if (isBiometricAvailable) {
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
    }
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      Alert.alert("Vân tay không trùng khớp!", "Vui lòng thử lại", [
        { text: "Quay về trang chủ", onPress: () => router.navigate("/") },
      ]);
    }
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Xác nhận vân tay",
      cancelLabel: "Hủy",
      disableDeviceFallback: true,
    });
    if (biometricAuth.success) {
      return true;
    }
    return false;
  };

  const renderpose = (poseNum: Pose) => {
    console.log("current pose", poseNum);

    if (poseNum == Pose.UP) {
      return "ngẫng đầu lên";
    } else if (poseNum == Pose.DOWN) {
      return "cuối đầu xuống";
    } else if (poseNum == Pose.LEFT) {
      return "quay đầu sang trái";
    } else if (poseNum == Pose.RIGHT) {
      return "quay đầu sang phải";
    } else if (poseNum == Pose.FRONT) {
      return "nhìn thẳng";
    }
  };

  return (
    <View style={styles.cameraWrapper} onLayout={() => setReady(true)}>
      <Text style={styles.title}>Đăng ký khuôn mặt</Text>
      {ready && device && (
        // <CameraView
        //   style={styles.camera}
        //   ref={ref}
        //   mode="picture"
        //   facing="front"
        //   mute={false}
        //   responsiveOrientationWhenOrientationLocked
        // />
        <View style={styles.camera}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused}
            frameProcessor={isFocused ? frameProcessor : undefined}
          />
        </View>
      )}
      {/* Face Detection Overlay */}
      <View style={styles.overlay}>
        {/* Face Detection Guide */}
        <View style={styles.faceGuideContainer}>
          <View style={styles.faceGuide}>
            <Animated.View
              style={[
                styles.cornerTopLeft,
                {
                  shadowOpacity: cornerAnim,
                  elevation: cornerAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.cornerTopRight,
                {
                  shadowOpacity: cornerAnim,
                  elevation: cornerAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.cornerBottomLeft,
                {
                  shadowOpacity: cornerAnim,
                  elevation: cornerAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.cornerBottomRight,
                {
                  shadowOpacity: cornerAnim,
                  elevation: cornerAnim,
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        {missingPose.length > 0 ? (
          <Text style={styles.modernInstructionText}>
            {"Hãy " + renderpose(missingPose[0]) + " để chụp ảnh"}
          </Text>
        ) : (
          <Text style={styles.modernInstructionText}>
            Bạn đã đăng ký đầy đủ hình ảnh!
          </Text>
        )}
      </View>

      {/* Progress bar */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <GradientProgress
          progress={(5 - missingPose.length) / 5}
          width={250}
          height={12}
          duration={600} // animation speed
        />
      </View>

      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        {/* Top Controls */}
        <View style={styles.topControls}></View>

        {/* Bottom Controls */}
        <View style={styles.shutterContainer}>
          {/*  
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <Animated.View
                style={[
                  styles.shutterButtonContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <View
                  style={[
                    styles.modernShutterBtn,
                    {
                      transform: [{ scale: pressed ? 0.9 : 1 }],
                    },
                  ]}
                >
                </View>
              </Animated.View>
            )}
          </Pressable>
          */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#292834",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: "15%",
    marginBottom: "5%",
  },
  camera: {
    height: "50%",
    width: "90%",
    marginHorizontal: "auto",
    borderRadius: 25,
    overflow: "hidden",
  },

  // Modern overlay styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topOverlay: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  bottomOverlay: {
    flex: 1,
  },

  statusContainer: {
    alignItems: "center",
    marginBottom: 30,
    height: 50,
  },

  modernModeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  textContainer: {
    marginTop: 30,
  },
  modeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  modernInstructionText: {
    color: "#292834",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: "10%",
  },
  // Enhanced face detection guide
  faceGuideContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  faceGuide: {
    width: 300,
    height: 380,
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: FaceGuide.top,
    left: FaceGuide.horizontal,
    width: FaceGuide.width,
    height: FaceGuide.height,
    borderTopWidth: FaceGuide.borderVerticalWidth,
    borderLeftWidth: FaceGuide.borderHorizontalWidth,
    borderColor: FaceGuide.color,
    borderTopLeftRadius: FaceGuide.radius,
    shadowColor: FaceGuide.color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerTopRight: {
    position: "absolute",
    top: FaceGuide.top,
    right: FaceGuide.horizontal,
    width: FaceGuide.width,
    height: FaceGuide.height,
    borderTopWidth: FaceGuide.borderVerticalWidth,
    borderRightWidth: FaceGuide.borderHorizontalWidth,
    borderColor: FaceGuide.color,
    borderTopRightRadius: FaceGuide.radius,
    shadowColor: FaceGuide.color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: FaceGuide.bottom,
    left: FaceGuide.horizontal,
    width: FaceGuide.width,
    height: FaceGuide.height,
    borderBottomWidth: FaceGuide.borderVerticalWidth,
    borderLeftWidth: FaceGuide.borderHorizontalWidth,
    borderColor: FaceGuide.color,
    borderBottomLeftRadius: FaceGuide.radius,
    shadowColor: FaceGuide.color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: FaceGuide.bottom,
    right: FaceGuide.horizontal,
    width: FaceGuide.width,
    height: FaceGuide.height,
    borderBottomWidth: FaceGuide.borderVerticalWidth,
    borderRightWidth: FaceGuide.borderHorizontalWidth,
    borderColor: FaceGuide.color,
    borderBottomRightRadius: FaceGuide.radius,
    shadowColor: FaceGuide.color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#4facfe",
    opacity: 0.8,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 5,
  },

  // Modern controls
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 50,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 25,
  },
  controlButton: {
    marginLeft: 15,
  },
  modernControlButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(20px)",
  },
  controlPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },

  // Modern shutter controls
  shutterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modeToggle: {
    alignItems: "center",
  },
  modernModeToggle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(20px)",
    marginBottom: 8,
  },
  modeToggleText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shutterButtonContainer: {
    alignItems: "center",
  },
  modernShutterBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shutterGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.9)",
  },
  modernRecordingIndicator: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  recordingPulse: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ff4444",
    shadowColor: "#ff4444",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 6,
  },
  modernRecordingText: {
    color: "#ff4444",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  placeholder: {
    width: 65,
  },
});

export default CameraPage;
