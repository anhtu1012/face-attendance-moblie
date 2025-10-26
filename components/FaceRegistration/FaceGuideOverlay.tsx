import { Animated, StyleSheet, View } from "react-native";

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

interface FaceGuideOverlayProps {
  cornerAnim: Animated.Value;
}

export const FaceGuideOverlay = ({ cornerAnim }: FaceGuideOverlayProps) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  // Modern overlay styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
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
});
