import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMissingPose, registerFace } from "@/services/face/api";
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
import {
  classifyPose,
  initialPoseData,
  renderpose,
} from "@/utils/faceRecognitionUtils";
import * as Brightness from "expo-brightness";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import AlertModal, {
  AlertModalProps,
  initialModalValue,
} from "@/components/ui/AlertModal";
import { createZip } from "@/utils/zipUtils";
import { submitForm } from "@/services/form/api";

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
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const [userProfile, setUserProfile] = useState<any>(null);
  const cornerAnim = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);
  const [missingPose, setMissingPose] = useState<any[]>([]);
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    cameraFacing: "front",
    landmarkMode: "all",
  }).current;
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });
  const [userFace, setUserFace] = useState<any>();
  const device = useCameraDevice("front");
  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);
  const isRegisteringRef = useRef(false);
  const registrationGeneration = useRef(0);
  const missingPoseRef = useRef<any[]>([]);
  const [modal, setModal] = useState<AlertModalProps>({
    visible: false,
    message: "",
    type: "success",
    title: "",
    onClose: () => setModal(initialModalValue),
  });
  missingPoseRef.current = missingPose;

  // useFocusEffect(
  //   useCallback(() => {
  //     let previousBrightness: number;
  //
  //     Brightness.getSystemBrightnessAsync().then((value) => {
  //       previousBrightness = value;
  //       Brightness.setSystemBrightnessAsync(1); // set to max when focused
  //     });
  //
  //     return () => {
  //       if (previousBrightness !== undefined) {
  //         Brightness.setSystemBrightnessAsync(previousBrightness);
  //       } else {
  //         Brightness.restoreSystemBrightnessAsync(); // fallback
  //       }
  //     };
  //   }, []),
  // );
  //

  // useEffect(() => {
  //   missingPoseRef.current = missingPose;
  // }, [missingPose]);

  useEffect(() => {
    // // load brightness
    // (async () => {
    //   await Brightness.requestPermissionsAsync();
    // })();
    return () => {
      // you must call `stopListeners` when current component is unmounted
      stopListeners();
    };
  }, []);

  // Load camera permission
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

  // flag variable to only allow one request at a time
  const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    if (isRegisteringRef.current) return;
    if (faces.length !== 1) return;
    const face = faces[0];
    setUserFace(face);

    // Get missing pose
    const currentMissingPose = missingPoseRef.current[0];

    // Get current pose
    const currentPose = classifyPose(face.yawAngle, face.pitchAngle);

    // If missing pose mismatch current pose -> stop
    if (currentPose !== currentMissingPose) return;

    console.log("currentPose: ", currentPose);
    // console.log("missingPose (ref): ", currentMissingPose);

    const currentGeneration = ++registrationGeneration.current;
    isRegisteringRef.current = true;

    try {
      const photo = await cameraRef.current?.takePhoto();
      if (!photo?.path || !userProfile?.id) return;

      // Create the full phto path
      const fullPhotoPath = `file://${photo.path}`;

      // store image uri once successfully checked
      setImagePaths((prev) => {
        console.log([...prev, fullPhotoPath]);
        return [...prev, fullPhotoPath];
      });

      if (currentGeneration !== registrationGeneration.current) return;
      // delete already checked pose
      setMissingPose((prev) => prev.slice(1));

      // Add haptic feed back when
      // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // show modal when already enough face
      if (currentMissingPose == 5) {
        // Create images zip file
        const zipUri = await createZip(imagePaths);

        // Create face form data
        const faceFormData = new FormData();
        faceFormData.append("userId", userProfile.id);
        faceFormData.append("img", {
          uri: zipUri,
          type: "application/zip",
          name: "faces.zip",
        } as any);

        // Register face in python
        await registerFace(faceFormData);

        // Create face register form's form data
        const formData = new FormData();
        formData.append("formId", "5");
        formData.append("submittedById", userProfile.id);
        formData.append(
          "reason",
          `Nhân viên ${userProfile.fullName} đăng ký khuôn mặt`,
        );
        formData.append("fileEvidence", {
          uri: zipUri,
          type: "application/zip",
          name: "faces.zip",
        } as any);
        formData.append("startTime", new Date().toISOString());

        // Send face register form
        await submitForm(formData);

        // Show success modal
        setModal((prev) => ({
          ...prev,
          visible: true,
          title: "Thành công",
          message: "Đăng ký khuôn mặt thành công",
          onClose: () => {
            setModal(initialModalValue);
            router.navigate("/");
          },
        }));
      }
    } catch (error: any) {
      console.log(`❌ ${error.response?.data?.message ?? error}`);
    } finally {
      if (currentGeneration === registrationGeneration.current) {
        isRegisteringRef.current = false;
      }
    }
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      runAsync(frame, () => {
        "worklet";
        const faces = detectFaces(frame);
        handleDetectedFaces(faces);
      });
    },
    [handleDetectedFaces],
  );

  useEffect(() => {
    // Clear old image paths data
    setImagePaths([]);

    const getUserProfile = async () => {
      let userDataStr = await AsyncStorage.getItem("userProfile");

      if (userDataStr) {
        const user = JSON.parse(userDataStr);

        let missingPoseRes = await getMissingPose(user.id);

        console.log("missing pose: ", missingPoseRes.data);

        if (missingPoseRes.data.missingPose === 6) {
          setMissingPose(initialPoseData);
        } else {
          setMissingPose([]);
        }

        setUserProfile(user);
      }
    };

    if (isFocused) getUserProfile();
  }, [isFocused]);

  return (
    <View style={styles.cameraWrapper} onLayout={() => setReady(true)}>
      <AlertModal {...modal} />
      <Text style={styles.title}>Đăng ký khuôn mặt</Text>
      {ready && device && (
        <View style={styles.camera}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused}
            frameProcessor={isFocused ? frameProcessor : undefined}
            photo={true}
            isMirrored={false}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setCameraLayout({ width, height });
            }}
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
            Bạn đã đăng ký đầy đủ hình ảnh
          </Text>
        )}
      </View>

      {/* Progress bar */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <GradientProgress
          progress={(6 - missingPose.length) / 6}
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
        <View style={styles.shutterContainer}></View>
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
