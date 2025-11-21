import { AlertModalProps, initialModalValue } from "@/components/ui/AlertModal";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, useFrameProcessor } from "react-native-vision-camera";
import {
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";

interface UserProfile {
  id: string;
  fullName: string;
}

interface CameraLayout {
  width: number;
  height: number;
}

const FACE_DETECTION_OPTIONS: FaceDetectionOptions = {
  cameraFacing: "front",
  landmarkMode: "all",
};

interface UseSingleFaceCaptureOptions {
  onCapture?: (imagePath: string) => Promise<void>;
  autoCapture?: boolean;
}

export const useTimekeep = (options?: UseSingleFaceCaptureOptions) => {
  const { onCapture, autoCapture = false } = options || {};

  // Refs
  const cameraRef = useRef<Camera>(null);
  const isCapturingRef = useRef(false);
  const hasCapturedRef = useRef(false);

  // State
  const isFocused = useIsFocused();
  const [ready, setReady] = useState(false);
  const [cameraLayout, setCameraLayout] = useState<CameraLayout>({
    width: 0,
    height: 0,
  });
  const [userFace, setUserFace] = useState<Face[] | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [modal, setModal] = useState<AlertModalProps>({
    visible: false,
    message: "",
    type: "success",
    title: "",
    onClose: () => setModal(initialModalValue),
  });

  // Face detection
  const { detectFaces, stopListeners } = useFaceDetector(
    FACE_DETECTION_OPTIONS,
  );

  // ==================== Helper Functions ====================
  const resetFaceDetection = useCallback(() => {
    setUserFace(null);
    hasCapturedRef.current = false;
  }, []);

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    if (!cameraRef.current || isCapturingRef.current) return null;

    isCapturingRef.current = true;

    try {
      const photo = await cameraRef.current.takePhoto();
      if (!photo?.path) return null;

      const fullPhotoPath = `file://${photo.path}`;
      setImagePath(fullPhotoPath);
      hasCapturedRef.current = true;

      // Call custom onCapture handler if provided
      if (onCapture) {
        await onCapture(fullPhotoPath);
      }

      return fullPhotoPath;
    } catch (error: any) {
      console.error(`❌ Capture error: ${error.message ?? error}`);
      return null;
    } finally {
      isCapturingRef.current = false;
    }
  }, [onCapture]);

  // ==================== Face Detection Handler ====================

  const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    // Skip if already capturing or already captured (for auto-capture mode)
    if (isCapturingRef.current || (autoCapture && hasCapturedRef.current)) {
      return;
    }

    // Validate single face detection
    if (faces.length !== 1) {
      setUserFace(null);
      return;
    }

    setUserFace(faces);

    // Auto-capture if enabled
    if (autoCapture && !hasCapturedRef.current) {
      await capturePhoto();
    }
  });

  // ==================== Frame Processor ====================

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
        if (
          isProcessing.current ||
          now - lastFrameTime.current < FRAME_SKIP_MS
        ) {
          return;
        }
        isProcessing.current = true;
        lastFrameTime.current = now;

        // Detect faces synchronously - plugin handles frame lifecycle
        const faces = detectFaces(frame);

        console.log("Faces result: ", faces);

        isProcessing.current = false;

        // Call handler on JS thread (already wrapped with createRunOnJS)
        if (
          faces &&
          faces.length === 1 &&
          faces[0].bounds.width <= 150 &&
          faces[0].bounds.height <= 150
        ) {
          handleDetectedFaces(faces);
        }
      } catch (error) {
        isProcessing.current = false;
        console.error("[FrameProcessor] Error:", error);
      }
    },
    [handleDetectedFaces],
  );

  // ==================== Effects ====================

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListeners();
    };
  }, [stopListeners]);

  // Request camera permissions
  useEffect(() => {
    if (!cameraRef.current) {
      stopListeners();
      return;
    }

    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log("Camera permission status:", status);
    })();
  }, [cameraRef.current, stopListeners]);

  // Reset when focus changes
  useEffect(() => {
    if (!isFocused) {
      resetFaceDetection();
      setImagePath(null);
    }
  }, [isFocused, resetFaceDetection]);

  // ==================== Event Handlers ====================

  const handleCameraLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setCameraLayout({ width, height });
  }, []);

  const retakePhoto = useCallback(() => {
    setImagePath(null);
    hasCapturedRef.current = false;
    resetFaceDetection();
  }, [resetFaceDetection]);

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
    imagePath,
    cameraLayout,

    // Setters
    setReady,
    setModal,
    setIsPending,

    // Handlers
    frameProcessor,
    handleCameraLayout,
    capturePhoto,
    retakePhoto,

    // Computed
    isDetectedFace: userFace !== null,
    hasCaptured: hasCapturedRef.current,
  };
};
