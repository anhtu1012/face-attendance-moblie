import { Dimensions, StyleSheet } from "react-native";

/**
 * Responsive FaceGuide Overlay Styles
 * Using percentage-based calculations for multi-device support
 */

// Get current screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Helper function to calculate responsive size
const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

/**
 * Face Guide Configuration
 * All values are calculated based on screen dimensions
 */
export const FaceGuide = {
  // Corner dimensions - responsive to screen width
  width: wp(11), // 11% of screen width
  height: wp(11), // Keep square aspect ratio based on width
  
  // Vertical positioning
  top: hp(23), // 23% from top
  bottom: -hp(3), // -3% from bottom (negative for overlap)
  
  // Horizontal margins
  horizontal: wp(10), // 10% from sides
  
  // Border widths - can be fixed or responsive
  borderVerticalWidth: Math.max(3, wp(1)), // Min 3px or 1% of width
  borderHorizontalWidth: Math.max(3, wp(1)),
  
  // Border radius
  radius: wp(10), // 10% of width
  
  // Colors
  color: "#fefcfb",
  colorDetected: "#4CAF50", // Green when face detected
  colorError: "#FF5252", // Red for errors
};

/**
 * Face Guide Area Configuration
 * The main oval/rectangle area for face placement
 */
export const FaceGuideArea = {
  width: wp(80), // 80% of screen width
  height: hp(50), // 50% of screen height
  maxWidth: 400, // Maximum width on large devices
  maxHeight: 500, // Maximum height on large devices
};

/**
 * Responsive Styles
 */
export const styles = StyleSheet.create({
  // Modern overlay styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  
  // Enhanced face detection guide container
  faceGuideContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  
  // Main face guide area
  faceGuide: {
    width: Math.min(FaceGuideArea.width, FaceGuideArea.maxWidth),
    height: Math.min(FaceGuideArea.height, FaceGuideArea.maxHeight),
    position: "relative",
  },
  
  // Corner styles with responsive positioning
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

/**
 * Function to create dynamic styles based on detection state
 * @param isDetected - Whether a face is detected
 * @returns Dynamic style object for corners
 */
export const getDynamicCornerStyle = (isDetected: boolean) => ({
  borderColor: isDetected ? FaceGuide.colorDetected : FaceGuide.color,
});

/**
 * Helper function to recalculate styles on orientation change
 * Call this in useEffect with Dimensions.addEventListener
 */
export const recalculateStyles = () => {
  const { width, height } = Dimensions.get("window");
  
  return {
    width: (width * 11) / 100,
    height: (width * 11) / 100,
    top: (height * 23) / 100,
    bottom: -(height * 3) / 100,
    horizontal: (width * 10) / 100,
    guideWidth: Math.min((width * 80) / 100, 400),
    guideHeight: Math.min((height * 50) / 100, 500),
  };
};

/**
 * Device size categories for additional customization if needed
 */
export const DeviceSize = {
  isSmallDevice: SCREEN_WIDTH < 375, // iPhone SE, small Android
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414, // iPhone 12/13
  isLargeDevice: SCREEN_WIDTH >= 414, // iPhone Pro Max, large Android
  isTablet: SCREEN_WIDTH >= 768, // iPad and tablets
};

/**
 * Adjust values based on device size
 */
export const getDeviceAdjustedValues = () => {
  if (DeviceSize.isSmallDevice) {
    return {
      cornerSize: wp(10), // Smaller corners on small devices
      guideWidth: wp(85), // Slightly wider guide
      fontSize: 15,
    };
  } else if (DeviceSize.isTablet) {
    return {
      cornerSize: wp(8), // Smaller corners on tablets (relative to width)
      guideWidth: wp(60), // Narrower guide on tablets
      fontSize: 20,
    };
  }
  
  return {
    cornerSize: wp(11),
    guideWidth: wp(80),
    fontSize: 17,
  };
};
