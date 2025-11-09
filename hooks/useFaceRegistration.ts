import { AlertModalProps, initialModalValue } from "@/components/ui/AlertModal";
import { getMissingPose, registerFace } from "@/services/face/api";
import { submitForm } from "@/services/form/api";
import { classifyPose, initialPoseData } from "@/utils/faceRecognitionUtils";
import { createZip } from "@/utils/zipUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  runAsync,
  useFrameProcessor,
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
    return () => {
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

      if (currentGeneration !== registrationGeneration.current) {
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
          setIsPending(false);
          setModal((prev) => ({
            ...prev,
            visible: true,
            type: "error",
            title: "Lỗi",
            message: "Không đủ ảnh để đăng ký. Vui lòng thử lại.",
            onClose: () => setModal(initialModalValue),
          }));
          return;
        }

        // Create images zip file
        const zipUri = await createZip(updatedImagePaths);

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
        formData.append("date", new Date().toISOString());

        // Send face register form
        await submitForm(formData);

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
      setIsPending(false);
      setModal((prev) => ({
        ...prev,
        visible: true,
        type: "error",
        title: "Lỗi",
        message: error.response?.data?.message || error.message || "Có lỗi xảy ra khi đăng ký khuôn mặt",
        onClose: () => setModal(initialModalValue),
      }));
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
    else if (!isFocused) setUserFace(null);
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
