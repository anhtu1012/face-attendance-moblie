import { StyleSheet } from "react-native";

export const FaceGuide = {
  width: 40,
  height: 40,
  top: 180,
  bottom: -25,
  horizontal: 40,
  borderVerticalWidth: 4,
  borderHorizontalWidth: 4,
  radius: 40,
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
