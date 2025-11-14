import { AlertModalProps, initialModalValue } from "@/components/ui/AlertModal";
import { formCategory } from "@/constants/form";
import { getMissingPose } from "@/services/face/api";
import { submitForm } from "@/services/form/api";
import { classifyPose, initialPoseData } from "@/utils/faceRecognitionUtils";
import { createZip } from "@/utils/zipUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  useFrameProcessor
} from "react-native-vision-camera";
import {
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";

export const useFaceRegistration = () => {
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [missingPose, setMissingPose] = useState<any[]>([]);
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    cameraFacing: "front",
    landmarkMode: "all",
  }).current;
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });
  const [userFace, setUserFace] = useState<any>(null);
  const [currentPose, setCurrentPose] = useState<number | null>(null);
  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);
  const isRegisteringRef = useRef(false);
  const registrationGeneration = useRef(0);
  const missingPoseRef = useRef<any[]>([]);
  const isMountedRef = useRef(true);
  const [modal, setModal] = useState<AlertModalProps>({
    visible: false,
    message: "",
    type: "success",
    title: "",
    onClose: () => setModal(initialModalValue),
  });
  const [isPending, setIsPending] = useState(false);
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
    isMountedRef.current = true;

    return () => {
      // Component is unmounting - cleanup everything
      isMountedRef.current = false;
      isRegisteringRef.current = false;

      // you must call `stopListeners` when current component is unmounted
      stopListeners();
    };
  }, []);

  // Load camera permission
  useEffect(() => {
    if (!cameraRef.current) {
      // you must call `stopListeners` when `Camera` component is unmounted
      stopListeners();
      return;
    }

    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log({ status });
    })();
  }, [cameraRef.current]);

  // flag variable to only allow one request at a time
  const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    if (isRegisteringRef.current) return;

    // Update userFace state based on face detection
    if (faces.length !== 1) {
      setUserFace(null); // Clear face when no face or multiple faces detected
      setCurrentPose(null);
      return;
    }

    const face = faces[0];
    setUserFace(face);

    // Get missing pose
    const currentMissingPose = missingPoseRef.current[0];

    // Get current pose
    const currentPose = classifyPose(face.yawAngle, face.pitchAngle);
    setCurrentPose(currentPose);

    // If missing pose mismatch current pose -> stop
    if (currentPose !== currentMissingPose) return;

    console.log("✅ Matched pose:", currentPose);

    // Prevent concurrent registrations
    if (isRegisteringRef.current) return;

    const currentGeneration = ++registrationGeneration.current;
    isRegisteringRef.current = true;

    try {
      const photo = await cameraRef.current?.takePhoto();

      // Check if component is still mounted
      if (!isMountedRef.current) {
        console.log("Component unmounted during photo capture");
        return;
      }

      if (!photo?.path || !userProfile?.id) {
        isRegisteringRef.current = false;
        return;
      }

      // Create the full phto path
      const fullPhotoPath = `file://${photo.path}`;

      // store image uri once successfully checked
      const updatedImagePaths = await new Promise<string[]>((resolve) => {
        setImagePaths((prev) => {
          const newPaths = [...prev, fullPhotoPath];
          console.log("Updated image paths:", newPaths);
          resolve(newPaths);
          return newPaths;
        });
      });

      // Check again if still mounted and generation is correct
      if (
        !isMountedRef.current ||
        currentGeneration !== registrationGeneration.current
      ) {
        isRegisteringRef.current = false;
        return;
      }

      // delete already checked pose
      setMissingPose((prev) => prev.slice(1));

      // Add haptic feed back when
      // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // show modal when already enough face
      if (currentMissingPose === 5) {
        // Show spinner
        setIsPending(true);

        // Ensure we have all 6 images
        if (updatedImagePaths.length !== 6) {
          console.error("Expected 6 images, got:", updatedImagePaths.length);
          if (isMountedRef.current) {
            setIsPending(false);
            setModal((prev) => ({
              ...prev,
              visible: true,
              type: "error",
              title: "Lỗi",
              message: "Không đủ ảnh để đăng ký. Vui lòng thử lại.",
              onClose: () => setModal(initialModalValue),
            }));
          }
          return;
        }

        // Create images zip file
        const zipUri = await createZip(updatedImagePaths);

        // Check if still mounted after async operation
        if (!isMountedRef.current) {
          console.log("Component unmounted during zip creation");
          return;
        }

        // Create face form data
        const faceFormData = new FormData();
        faceFormData.append("userId", userProfile.id);
        faceFormData.append("img", {
          uri: zipUri,
          type: "application/zip",
          name: "faces.zip",
        } as any);

        // Register face in python
        // await registerFace(faceFormData);

        // Create face register form's form data
        const formData = new FormData();
        formData.append("formId", formCategory.FACE_REGISTER.toString());
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
        formData.append("date", new Date().toISOString());

        // Send face register form
        await submitForm(formData);

        // Check if still mounted after API call
        if (!isMountedRef.current) {
          console.log("Component unmounted during form submission");
          return;
        }

        // Hide spinner
        setIsPending(false);

        // Show success modal
        setModal((prev) => ({
          ...prev,
          visible: true,
          type: "success",
          title: "Thành công",
          message: "Đăng ký khuôn mặt thành công",
          onClose: () => {
            setModal(initialModalValue);
            router.navigate("/");
          },
        }));
      }
    } catch (error: any) {
      console.error("Face registration error:", error);

      if (isMountedRef.current) {
        setIsPending(false);
        setModal((prev) => ({
          ...prev,
          visible: true,
          type: "error",
          title: "Lỗi",
          message:
            error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra khi đăng ký khuôn mặt",
          onClose: () => setModal(initialModalValue),
        }));
      }
    } finally {
      if (currentGeneration === registrationGeneration.current) {
        isRegisteringRef.current = false;
      }
    }
  });

  // Frame skipping to prevent memory leaks
  const lastFrameTime = useRef(0);
  const isProcessing = useRef(false);
  const FRAME_SKIP_MS = 500; // Process max 2 frames per second

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      try {
        const now = Date.now();
        // Skip frames if processing too fast or already processing
        if (isProcessing.current || now - lastFrameTime.current < FRAME_SKIP_MS) {
          return;
        }
        isProcessing.current = true;
        lastFrameTime.current = now;
        
        // Detect faces synchronously - plugin handles frame lifecycle
        const faces = detectFaces(frame);
        isProcessing.current = false;
        
        // Call handler on JS thread (already wrapped with createRunOnJS)
        if (faces && faces.length > 0) {
          handleDetectedFaces(faces);
        }
      } catch (error) {
        isProcessing.current = false;
        console.error("[FrameProcessor] Error:", error);
      }
    },
    [handleDetectedFaces],
  );

  useEffect(() => {
    let isMounted = true;

    const getUserProfile = async () => {
      try {
        // Clear old image paths data
        if (isMounted) {
          setImagePaths([]);
        }

        // Try both keys for compatibility
        let userDataStr = await AsyncStorage.getItem("userProfile");
        if (!userDataStr) {
          userDataStr = await AsyncStorage.getItem("userData");
        }

        if (!userDataStr) {
          console.error("No user profile found in AsyncStorage");
          if (isMounted) {
            setModal({
              visible: true,
              type: "error",
              title: "Lỗi",
              message:
                "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
              onClose: () => {
                setModal(initialModalValue);
                router.back();
              },
            });
          }
          return;
        }

        const user = JSON.parse(userDataStr);

        if (!user?.id) {
          console.error("User profile missing ID:", user);
          return;
        }

        const missingPoseRes = await getMissingPose(user.id);

        console.log("missing pose response:", missingPoseRes.data);

        if (!isMounted) return;

        if (missingPoseRes.data.missingPose === 6) {
          setMissingPose(initialPoseData);
        } else {
          setMissingPose([]);
        }

        setUserProfile(user);
      } catch (error: any) {
        console.error("Error loading user profile:", error);
        if (isMounted) {
          setModal({
            visible: true,
            type: "error",
            title: "Lỗi",
            message: error.message || "Không thể tải thông tin người dùng",
            onClose: () => setModal(initialModalValue),
          });
        }
      }
    };

    if (isFocused) {
      getUserProfile();
    } else {
      setUserFace(null);
    }

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const handleCameraLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setCameraLayout({ width, height });
  };

  return {
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
  };
};
