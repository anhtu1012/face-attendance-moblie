import { AlertModalProps, initialModalValue } from "@/components/ui/AlertModal";
import { formCategory } from "@/constants/form";
import { getMissingPose } from "@/services/face/api";
import { submitForm } from "@/services/form/api";
import { classifyPose, initialPoseData } from "@/utils/faceRecognitionUtils";
import { createZip } from "@/utils/zipUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, useFrameProcessor } from "react-native-vision-camera";
import {
  detectFaces as detectFacesInImage,
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";

// ==================== Constants ====================
const FACE_DETECTION_OPTIONS: FaceDetectionOptions = {
  cameraFacing: "front",
  landmarkMode: "all",
};

const IMAGE_VALIDATION_OPTIONS = {
  landmarkMode: "all" as const,
  performanceMode: "accurate" as const,
  // performanceMode: "fast" as const,
};

const FRAME_SKIP_MS = 500; // Process max 2 frames per second
const REQUIRED_IMAGES_COUNT = 6;
const FINAL_POSE_INDEX = 5;
const CAPTURE_DELAY_MS = 300; // Delay before capture for focus
const POST_CAPTURE_DELAY_MS = 500; // Delay after capture before validation
const MIN_FACE_SIZE_RATIO = 0.12; // Minimum face size relative to frame (12% - more forgiving)
const MIN_LANDMARKS_COUNT = 2; // Minimum number of landmark points required (reduced from 3)

// ==================== Types ====================
interface CameraLayout {
  width: number;
  height: number;
}

interface UserProfile {
  id: string;
  fullName: string;
}

interface CapturedFaceData {
  imagePath: string;
  face: Face;
  pose: number;
}

// ==================== Main Hook ====================
// ==================== Main Hook ====================
export const useFaceRegistration = () => {
  // ==================== Refs ====================
  const cameraRef = useRef<Camera>(null);
  const isRegisteringRef = useRef(false);
  const registrationGeneration = useRef(0);
  const missingPoseRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);
  const lastFrameTime = useRef(0);
  const isProcessing = useRef(false);

  // ==================== State ====================
  const isFocused = useIsFocused();
  const [ready, setReady] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // User & Profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Face Detection
  const [userFace, setUserFace] = useState<Face | null>(null);
  const [currentPose, setCurrentPose] = useState<number | null>(null);
  const [missingPose, setMissingPose] = useState<number[]>([]);
  const [capturingPose, setCapturingPose] = useState<number | null>(null);

  // Images
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [capturedFaces, setCapturedFaces] = useState<CapturedFaceData[]>([]);
  const [cameraLayout, setCameraLayout] = useState<CameraLayout>({
    width: 0,
    height: 0,
  });

  // UI
  const [modal, setModal] = useState<AlertModalProps>({
    visible: false,
    message: "",
    type: "success",
    title: "",
    onClose: () => setModal(initialModalValue),
  });

  // ==================== Face Detector ====================
  const { detectFaces, stopListeners } = useFaceDetector(
    FACE_DETECTION_OPTIONS,
  );

  // ==================== Helper Functions ====================

  /**
   * Resets all registration state to initial values
   */
  const resetRegistrationState = useCallback(() => {
    console.log("🔄 Resetting registration state...");

    // Reset refs
    isRegisteringRef.current = false;
    registrationGeneration.current++;
    missingPoseRef.current = [];
    lastFrameTime.current = 0;
    isProcessing.current = false;

    // Reset state
    setReady(false);
    setIsPending(false);
    setUserProfile(null);
    setUserFace(null);
    setCurrentPose(null);
    setMissingPose([]);
    setCapturingPose(null);
    setImagePaths([]);
    setCapturedFaces([]);
    setModal(initialModalValue);

    console.log("✅ Registration state reset complete");
  }, []);

  /**
   * Shows error modal with message
   */
  const showErrorModal = useCallback(
    (message: string, onClose?: () => void) => {
      if (!isMountedRef.current) return;

      setModal({
        visible: true,
        type: "error",
        title: "Lỗi",
        message,
        onClose: onClose || (() => setModal(initialModalValue)),
      });
    },
    [],
  );

  /**
   * Shows error modal with retry option
   */
  const showErrorWithRetry = useCallback((message: string) => {
    if (!isMountedRef.current) return;

    setModal({
      visible: true,
      type: "error",
      title: "Lỗi",
      message: message + "\n\nVui lòng thử lại.",
      onClose: () => {
        setModal(initialModalValue);
        // Reset to allow retry
        setImagePaths([]);
        setCapturedFaces([]);
        setMissingPose(initialPoseData);
        setUserFace(null);
        setCurrentPose(null);
        setCapturingPose(null);
        isRegisteringRef.current = false;
        registrationGeneration.current++;
        console.log("🔄 Ready for retry");
      },
    });
  }, []);

  /**
   * Shows success modal with message
   */
  const showSuccessModal = useCallback(
    (message: string, onClose?: () => void) => {
      if (!isMountedRef.current) return;

      setModal({
        visible: true,
        type: "success",
        title: "Thành công",
        message,
        onClose: onClose || (() => setModal(initialModalValue)),
      });
    },
    [],
  );

  /**
   * Validates if single face detected
   */
  const validateSingleFace = useCallback((faces: Face[]): Face | null => {
    if (faces.length !== 1) {
      setUserFace(null);
      setCurrentPose(null);
      return null;
    }
    return faces[0];
  }, []);

  /**
   * Checks if pose matches the required missing pose
   */
  const isPoseMatched = useCallback(
    (detectedPose: number, requiredPose: number): boolean => {
      return detectedPose === requiredPose;
    },
    [],
  );

  /**
   * Validates face quality (size and bounds)
   */
  const validateFaceQuality = useCallback(
    (
      face: Face,
      frameWidth: number,
      frameHeight: number,
    ): { valid: boolean; reason?: string } => {
      // Check if face bounds are valid
      if (!face.bounds) {
        return {
          valid: false,
          reason: "Không phát hiện được khuôn mặt rõ ràng",
        };
      }

      const { width: faceWidth, height: faceHeight } = face.bounds;
      const frameArea = frameWidth * frameHeight;
      const faceArea = faceWidth * faceHeight;
      const faceSizeRatio = faceArea / frameArea;

      // Check if face is too small (might be blurry or too far)
      if (faceSizeRatio < MIN_FACE_SIZE_RATIO) {
        console.warn(
          `⚠️ Face too small: ${(faceSizeRatio * 100).toFixed(1)}% (min: ${MIN_FACE_SIZE_RATIO * 100}%)`,
        );
        return {
          valid: false,
          reason: "Khuôn mặt quá nhỏ. Vui lòng đưa mặt gần camera hơn",
        };
      }

      // Check if face has landmarks (just warn, don't fail for real-time detection)
      if (!face.landmarks || Object.keys(face.landmarks).length === 0) {
        console.warn("⚠️ No landmarks detected in real-time, but allowing capture");
        // Don't fail here - final validation will catch truly bad images
      }

      console.log(
        `✅ Face quality OK: size=${(faceSizeRatio * 100).toFixed(1)}%`,
      );
      return { valid: true };
    },
    [],
  );

  /**
   * Validates all captured faces before submission
   */
  const validateAllCapturedFaces = useCallback(
    (
      capturedFaces: CapturedFaceData[],
    ): { valid: boolean; message?: string } => {
      if (capturedFaces.length !== REQUIRED_IMAGES_COUNT) {
        return {
          valid: false,
          message: `Chỉ có ${capturedFaces.length}/${REQUIRED_IMAGES_COUNT} ảnh. Vui lòng đăng ký lại.`,
        };
      }

      // Check if all faces are present and of good quality
      for (let i = 0; i < capturedFaces.length; i++) {
        const { face, pose } = capturedFaces[i];

        if (!face || !face.bounds) {
          return {
            valid: false,
            message: `Ảnh tư thế ${i + 1} không chứa khuôn mặt rõ ràng. Vui lòng đăng ký lại và di chuyển đầu CHẬM HƠN.`,
          };
        }

        // Verify face has essential landmarks
        if (!face.landmarks || Object.keys(face.landmarks).length === 0) {
          return {
            valid: false,
            message: `Ảnh tư thế ${i + 1} không rõ nét. Vui lòng đăng ký lại và di chuyển đầu CHẬM HƠN để camera lấy nét.`,
          };
        }
      }

      console.log("✅ All 6 faces validated successfully");
      return { valid: true };
    },
    [],
  );

  /**
   * Validates saved images by re-detecting faces to ensure quality
   * This catches blurry images that might have passed initial detection
   */
  const validateSavedImages = useCallback(
    async (
      imagePaths: string[],
    ): Promise<{ valid: boolean; message?: string }> => {
      console.log("🔍 Validating saved images...");

      if (imagePaths.length !== REQUIRED_IMAGES_COUNT) {
        return {
          valid: false,
          message: `Chỉ có ${imagePaths.length}/${REQUIRED_IMAGES_COUNT} ảnh được lưu.`,
        };
      }

      try {
        // Re-detect faces in all saved images
        for (let i = 0; i < imagePaths.length; i++) {
          const imagePath = imagePaths[i];
          console.log(
            `🖼️ Validating image ${i + 1}/${REQUIRED_IMAGES_COUNT}: ${imagePath}`,
          );

          // Detect faces in the saved image
          const detectedFaces = await detectFacesInImage({
            image: imagePath,
            options: IMAGE_VALIDATION_OPTIONS,
          });

          // Must have exactly one face
          if (!detectedFaces || detectedFaces.length === 0) {
            console.error(`❌ No face detected in image ${i + 1}`);
            return {
              valid: false,
              message: `Ảnh số ${i + 1} BỊ MỜ hoặc không chứa khuôn mặt.\n\n⚠️ Vui lòng đăng ký lại và di chuyển đầu CHẬM HƠN để camera lấy nét rõ ràng.`,
            };
          }

          if (detectedFaces.length > 1) {
            console.error(`❌ Multiple faces detected in image ${i + 1}`);
            return {
              valid: false,
              message: `Ảnh số ${i + 1} phát hiện nhiều hơn 1 khuôn mặt.\n\nVui lòng đăng ký lại trong môi trường chỉ có bạn.`,
            };
          }

          const face = detectedFaces[0];

          // Validate face has clear bounds
          if (
            !face.bounds ||
            face.bounds.width === 0 ||
            face.bounds.height === 0
          ) {
            console.error(`❌ Invalid face bounds in image ${i + 1}`);
            return {
              valid: false,
              message: `Ảnh số ${i + 1} không phát hiện được khuôn mặt rõ ràng.\n\n⚠️ Vui lòng đăng ký lại và di chuyển đầu CHẬM HƠN.`,
            };
          }

          // Validate face has landmarks (indicates good quality, not blurry)
          const landmarkCount = face.landmarks
            ? Object.keys(face.landmarks).length
            : 0;
          if (landmarkCount < MIN_LANDMARKS_COUNT) {
            console.error(
              `❌ Insufficient landmarks in image ${i + 1}: ${landmarkCount} < ${MIN_LANDMARKS_COUNT}`,
            );
            return {
              valid: false,
              message: `Ảnh số ${i + 1} BỊ MỜ - không phát hiện được đủ đặc điểm khuôn mặt (${landmarkCount}/${MIN_LANDMARKS_COUNT}).\n\n⚠️ Vui lòng đăng ký lại và:\n• Di chuyển đầu CHẬM HƠN\n• Giữ đầu ổn định khi chụp\n• Đảm bảo ánh sáng đủ`,
            };
          }

          // Validate face size (not too small)
          const faceArea = face.bounds.width * face.bounds.height;
          const minArea = 7000; // Minimum face area in pixels (reduced from 10000)
          if (faceArea < minArea) {
            console.error(
              `❌ Face too small in image ${i + 1}: ${faceArea} < ${minArea}`,
            );
            return {
              valid: false,
              message: `Ảnh số ${i + 1} - khuôn mặt quá nhỏ hoặc BỊ MỜ.\n\n⚠️ Vui lòng đăng ký lại và đưa mặt gần camera hơn.`,
            };
          }

          console.log(
            `✅ Image ${i + 1} valid: landmarks=${landmarkCount}, area=${faceArea.toFixed(0)}px²`,
          );
        }

        console.log("✅ All saved images validated successfully!");
        return { valid: true };
      } catch (error: any) {
        console.error("❌ Error validating saved images:", error);
        return {
          valid: false,
          message: `Lỗi khi kiểm tra chất lượng ảnh: ${error.message}\n\nVui lòng thử lại.`,
        };
      }
    },
    [],
  );

  /**
   * Captures photo from camera
   */
  const capturePhoto = useCallback(async (): Promise<string | null> => {
    // Add delay to allow camera to focus and stabilize
    await new Promise((resolve) => setTimeout(resolve, CAPTURE_DELAY_MS));

    const photo = await cameraRef.current?.takePhoto();

    if (!photo?.path) {
      console.error("Photo capture failed");
      return null;
    }

    return `file://${photo.path}`;
  }, []);

  /**
   * Adds image path to collection
   */
  const addImagePath = useCallback(
    async (imagePath: string): Promise<string[]> => {
      return new Promise((resolve) => {
        setImagePaths((prev) => {
          const newPaths = [...prev, imagePath];
          console.log(
            `📸 Captured ${newPaths.length}/${REQUIRED_IMAGES_COUNT} images`,
          );
          resolve(newPaths);
          return newPaths;
        });
      });
    },
    [],
  );

  /**
   * Submits registration form with images
   */
  const submitRegistration = useCallback(
    async (zipUri: string) => {
      if (!userProfile) throw new Error("User profile not found");

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

      await submitForm(formData);
    },
    [userProfile],
  );

  /**
   * Processes completion of all pose captures
   */
  const handleRegistrationComplete = useCallback(
    async (imagePaths: string[]) => {
      if (imagePaths.length !== REQUIRED_IMAGES_COUNT) {
        throw new Error(
          `Expected ${REQUIRED_IMAGES_COUNT} images, got ${imagePaths.length}`,
        );
      }

      setIsPending(true);

      try {
        console.log("⏳ Starting final validation of captured images...");

        // Add a small delay to ensure images are fully written to disk
        await new Promise((resolve) =>
          setTimeout(resolve, POST_CAPTURE_DELAY_MS),
        );

        // CRITICAL: Validate saved images by re-detecting faces
        // This catches blurry images that passed initial detection
        const imageValidation = await validateSavedImages(imagePaths);

        if (!imageValidation.valid) {
          setIsPending(false);
          console.error("❌ Image validation failed:", imageValidation.message);

          // Reset registration state to start over
          setImagePaths([]);
          setCapturedFaces([]);
          setMissingPose(initialPoseData);
          setUserFace(null);
          registrationGeneration.current++;

          // Show error with retry option
          showErrorWithRetry(
            imageValidation.message || "Image validation failed",
          );
          return; // Exit early, don't throw
        }

        console.log("✅ All images validated - creating zip...");

        // Create zip file
        const zipUri = await createZip(imagePaths);

        if (!zipUri) {
          throw new Error("Failed to create zip file");
        }

        if (!isMountedRef.current) return;

        // Submit form
        await submitRegistration(zipUri);

        if (!isMountedRef.current) return;

        setIsPending(false);

        // Show success and navigate
        showSuccessModal("Đăng ký khuôn mặt thành công", () => {
          setModal(initialModalValue);
          router.replace({
            pathname: "/(drawer)/(tabs)",
            params: { refetchForms: "true" },
          });
        });
      } catch (error: any) {
        setIsPending(false);
        console.error("❌ Registration submission error:", error);

        // Reset state
        setImagePaths([]);
        setCapturedFaces([]);
        setMissingPose(initialPoseData);
        setUserFace(null);
        registrationGeneration.current++;

        // Show error with retry
        showErrorWithRetry(
          error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra khi đăng ký khuôn mặt",
        );
      }
    },
    [
      submitRegistration,
      showSuccessModal,
      validateSavedImages,
      showErrorWithRetry,
    ],
  );

  // ==================== Sync Missing Pose Ref ====================
  useEffect(() => {
    missingPoseRef.current = missingPose;
  }, [missingPose]);

  // ==================== Lifecycle Effects ====================

  // Component mount/unmount cleanup
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      console.log("🚪 Component unmounting - cleaning up...");
      isMountedRef.current = false;
      isRegisteringRef.current = false;
      stopListeners();

      // Reset all registration state when exiting
      resetRegistrationState();
    };
  }, [stopListeners, resetRegistrationState]);

  // Camera permission request
  useEffect(() => {
    if (!cameraRef.current) {
      stopListeners();
      return;
    }

    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log("📷 Camera permission:", status);
    })();
  }, [cameraRef.current, stopListeners]);

  // ==================== Face Detection Handler ====================

  const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    // Skip if already processing
    if (isRegisteringRef.current) return;

    // Validate single face
    const face = validateSingleFace(faces);
    if (!face) return;

    setUserFace(face);

    // Get required pose and current detected pose
    const requiredPose = missingPoseRef.current[0];
    const detectedPose = classifyPose(face.yawAngle, face.pitchAngle);
    setCurrentPose(detectedPose);

    // Check if pose matches
    if (!isPoseMatched(detectedPose, requiredPose)) return;

    console.log("✅ Pose matched:", detectedPose);

    // Lock registration to prevent duplicates
    const currentGeneration = ++registrationGeneration.current;
    isRegisteringRef.current = true;
    setCapturingPose(requiredPose);
    setMissingPose((prev) => prev.slice(1));

    try {
      // Validate face quality before capture
      const frameWidth = cameraLayout.width || 1080;
      const frameHeight = cameraLayout.height || 1920;
      const qualityCheck = validateFaceQuality(face, frameWidth, frameHeight);

      if (!qualityCheck.valid) {
        console.warn("⚠️ Face quality check failed:", qualityCheck.reason);
        setMissingPose((prev) => [requiredPose, ...prev]);
        setCapturingPose(null);
        isRegisteringRef.current = false;
        showErrorModal(
          qualityCheck.reason || "Khuôn mặt không rõ ràng. Vui lòng thử lại.",
        );
        return;
      }

      // Capture photo
      const photoPath = await capturePhoto();

      // Validate capture
      if (!isMountedRef.current || !photoPath || !userProfile) {
        console.error("Capture validation failed");
        setMissingPose((prev) => [requiredPose, ...prev]);
        setCapturingPose(null);
        isRegisteringRef.current = false;
        return;
      }

      // Add image to collection
      const updatedImagePaths = await addImagePath(photoPath);

      // Store captured face data for final validation
      setCapturedFaces((prev) => [
        ...prev,
        { imagePath: photoPath, face, pose: requiredPose },
      ]);

      // Check if generation is still valid
      if (
        !isMountedRef.current ||
        currentGeneration !== registrationGeneration.current
      ) {
        setCapturingPose(null);
        isRegisteringRef.current = false;
        return;
      }

      setCapturingPose(null);

      // If this was the final pose, complete registration
      if (requiredPose === FINAL_POSE_INDEX) {
        await handleRegistrationComplete(updatedImagePaths);
      }
    } catch (error: any) {
      console.error("❌ Face registration error:", error);

      // Restore pose on error (except for final pose - that will be handled by handleRegistrationComplete)
      if (requiredPose !== FINAL_POSE_INDEX) {
        console.log("Restoring pose due to error:", requiredPose);
        setMissingPose((prev) => [requiredPose, ...prev]);
        setCapturingPose(null);

        showErrorModal(
          error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra khi chụp ảnh. Vui lòng thử lại.",
        );
      }
      // For final pose errors, handleRegistrationComplete will handle the error display
    } finally {
      if (currentGeneration === registrationGeneration.current) {
        isRegisteringRef.current = false;
      }
    }
  });

  // ==================== Frame Processor ====================

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      try {
        const now = Date.now();

        // Skip if processing too fast or already busy
        if (
          isProcessing.current ||
          now - lastFrameTime.current < FRAME_SKIP_MS
        ) {
          return;
        }

        isProcessing.current = true;
        lastFrameTime.current = now;

        // Detect faces
        const faces = detectFaces(frame);
        isProcessing.current = false;

        // Process detected faces on JS thread
        if (faces && faces.length > 0) {
          handleDetectedFaces(faces);
        }
      } catch (error) {
        isProcessing.current = false;
        console.error("❌ [FrameProcessor] Error:", error);
      }
    },
    [handleDetectedFaces],
  );

  // ==================== User Profile Loading ====================

  const loadUserProfile = useCallback(async () => {
    try {
      setImagePaths([]);
      setCapturedFaces([]);

      // Load user profile from storage (try both keys for compatibility)
      const userDataStr =
        (await AsyncStorage.getItem("userProfile")) ||
        (await AsyncStorage.getItem("userData"));

      if (!userDataStr) {
        throw new Error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        );
      }

      const user: UserProfile = JSON.parse(userDataStr);

      if (!user?.id) {
        throw new Error("Thông tin người dùng không hợp lệ");
      }

      // Get missing poses for this user
      const missingPoseRes = await getMissingPose(user.id);
      console.log("📋 Missing pose response:", missingPoseRes.data);

      if (!isMountedRef.current) return;

      // Set poses - if all 6 missing, start fresh; otherwise empty
      if (missingPoseRes.data.missingPose === 6) {
        setMissingPose(initialPoseData);
      } else {
        setMissingPose([]);
      }

      setUserProfile(user);
    } catch (error: any) {
      console.error("❌ Error loading user profile:", error);

      if (!isMountedRef.current) return;

      // Only navigate back for critical auth errors
      const isCriticalError =
        error.message?.includes("đăng nhập") ||
        error.message?.includes("không hợp lệ");

      if (isCriticalError) {
        showErrorModal(
          error.message || "Không thể tải thông tin người dùng",
          () => {
            setModal(initialModalValue);
            router.back();
          },
        );
      } else {
        // For network/API errors, just show error without navigation
        showErrorModal(
          error.message || "Không thể tải dữ liệu. Vui lòng thử lại.",
        );
      }
    }
  }, [showErrorModal]);

  // Load profile when focused
  useEffect(() => {
    if (isFocused) {
      loadUserProfile();
    } else {
      // Reset state when navigating away from this screen
      console.log("📱 Screen lost focus - resetting state...");
      setUserFace(null);
      setCurrentPose(null);
      setCapturingPose(null);

      // Only reset registration data if not pending submission
      if (!isPending) {
        setImagePaths([]);
        setCapturedFaces([]);
        setMissingPose([]);
        isRegisteringRef.current = false;
        registrationGeneration.current++;
      }
    }
  }, [isFocused, loadUserProfile, isPending]);

  // ==================== Camera Layout Handler ====================

  const handleCameraLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setCameraLayout({ width, height });
  }, []);

  // ==================== Return Values ====================

  return {
    // Refs
    cameraRef,

    // State
    isFocused,
    ready,
    isPending,
    modal,
    userFace,
    currentPose,
    capturingPose,
    missingPose,

    // Setters
    setReady,
    setModal,

    // Handlers
    frameProcessor,
    handleCameraLayout,
    resetRegistrationState,
  };
};
