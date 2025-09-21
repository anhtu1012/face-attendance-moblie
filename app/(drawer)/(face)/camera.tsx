import {
  AntDesign,
  Feather,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { CameraMode, CameraType, CameraView } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const CameraPage = () => {
  const ref = useRef<CameraView>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("front");
  const [uri, setUri] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUpdatingFace, setIsUpdatingFace] = useState(false);
  const [recording, setRecording] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cornerAnim = useRef(new Animated.Value(0)).current;

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo!.uri);
    if (userProfile.faceImg) {
      setIsUpdatingFace(false);
    }
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };
  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  return (
    <View style={styles.cameraWrapper}>
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
        mute={false}
        mirror={facing === "front"}
        responsiveOrientationWhenOrientationLocked
      />
      {/* Face Detection Overlay */}
      <View style={styles.overlay}>
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          style={styles.topOverlay}
        >
          <View style={styles.statusContainer}>
            <View style={styles.modernModeIndicator}>
              <MaterialIcons
                name={mode === "picture" ? "camera-alt" : "videocam"}
                size={18}
                color="white"
              />
              <Text style={styles.modeText}>
                {mode === "picture" ? "Ảnh" : "Video"}
              </Text>
            </View>
          </View>

          <Text style={styles.modernInstructionText}>
            Đặt khuôn mặt vào khung hình để đăng ký
          </Text>
        </LinearGradient>

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
            <View style={styles.scanLine} />
          </View>
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.bottomOverlay}
        />
      </View>

      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <Pressable style={styles.controlButton} onPress={toggleFacing}>
            {({ pressed }) => (
              <View
                style={[
                  styles.modernControlButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <FontAwesome6 name="rotate" size={20} color="white" />
              </View>
            )}
          </Pressable>
        </View>

        {/* Bottom Controls */}
        <View style={styles.shutterContainer}>
          <Pressable style={styles.modeToggle} onPress={toggleMode}>
            {({ pressed }) => (
              <View
                style={[
                  styles.modernModeToggle,
                  pressed && styles.controlPressed,
                ]}
              >
                {mode === "picture" ? (
                  <Feather name="video" size={24} color="white" />
                ) : (
                  <AntDesign name="picture" size={24} color="white" />
                )}
                <Text style={styles.modeToggleText}>
                  {mode === "picture" ? "Video" : "Ảnh"}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
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
                  <LinearGradient
                    colors={
                      mode === "picture"
                        ? ["#fff", "#f0f0f0"]
                        : recording
                          ? ["#ff6b6b", "#ff5252"]
                          : ["#ff6b6b", "#ff5252"]
                    }
                    style={styles.shutterGradient}
                  />
                  {recording && (
                    <View style={styles.modernRecordingIndicator}>
                      <View style={styles.recordingPulse} />
                    </View>
                  )}
                </View>
                {recording && (
                  <Text style={styles.modernRecordingText}>REC</Text>
                )}
              </Animated.View>
            )}
          </Pressable>

          <View style={styles.placeholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
    width: "100%",
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
  modeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  modernInstructionText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  // Enhanced face detection guide
  faceGuideContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  faceGuide: {
    width: 300,
    height: 380,
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: "#4facfe",
    borderTopLeftRadius: 12,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: "#4facfe",
    borderTopRightRadius: 12,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 50,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: "#4facfe",
    borderBottomLeftRadius: 12,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 50,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: "#4facfe",
    borderBottomRightRadius: 12,
    shadowColor: "#4facfe",
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
    justifyContent: "space-between",
    paddingHorizontal: 35,
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
