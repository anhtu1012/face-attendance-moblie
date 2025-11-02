import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Calculate responsive values based on screen dimensions
export const FaceGuide = {
  // Corner dimensions - 5% of screen width
  width: SCREEN_WIDTH * 0.11, // ~11% of screen width (about 40-50px on most devices)
  height: SCREEN_WIDTH * 0.11,
  
  // Position from top - 23% of screen height
  top: SCREEN_HEIGHT * 0.23,
  
  // Position from bottom - negative value to adjust
  bottom: -SCREEN_HEIGHT * 0.03,
  
  // Horizontal margin - 10% of screen width
  horizontal: SCREEN_WIDTH * 0.1,
  
  // Border widths
  borderVerticalWidth: 4,
  borderHorizontalWidth: 4,
  
  // Border radius
  radius: SCREEN_WIDTH * 0.1,
  
  // Color
  color: "#fefcfb",
};

export const styles = StyleSheet.create({
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
    // Responsive: 80% of screen width, with max aspect ratio
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.5, // 50% of screen height
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
  },
});
