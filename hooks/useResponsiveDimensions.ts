import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

/**
 * Custom hook to handle responsive dimensions
 * Automatically updates when device orientation changes
 */
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get("window");
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window }: { window: ScaledSize }) => {
        setDimensions({ width: window.width, height: window.height });
      }
    );

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

/**
 * Helper functions to calculate responsive sizes
 */
export const useResponsiveSize = () => {
  const { width, height } = useResponsiveDimensions();

  const wp = (percentage: number) => (width * percentage) / 100;
  const hp = (percentage: number) => (height * percentage) / 100;

  // Calculate font size based on device width
  const fontSize = (size: number) => {
    const baseWidth = 375; // iPhone X width as base
    return (width / baseWidth) * size;
  };

  return { width, height, wp, hp, fontSize };
};

/**
 * Hook specifically for Face Guide dimensions
 * Returns all necessary values for responsive Face Guide
 */
export const useFaceGuideDimensions = () => {
  const { width, height, wp, hp } = useResponsiveSize();

  const isSmallDevice = width < 375;
  const isTablet = width >= 768;

  return {
    // Screen dimensions
    screenWidth: width,
    screenHeight: height,

    // Device type flags
    isSmallDevice,
    isTablet,

    // Corner dimensions
    cornerWidth: wp(isSmallDevice ? 10 : isTablet ? 8 : 11),
    cornerHeight: wp(isSmallDevice ? 10 : isTablet ? 8 : 11),

    // Guide area
    guideWidth: Math.min(wp(isTablet ? 60 : 80), 400),
    guideHeight: Math.min(hp(50), 500),

    // Positioning
    topPosition: hp(23),
    bottomPosition: -hp(3),
    horizontalMargin: wp(10),

    // Border widths
    borderWidth: Math.max(3, wp(1)),

    // Font sizes
    titleFontSize: isSmallDevice ? 15 : isTablet ? 20 : 17,
    instructionFontSize: isSmallDevice ? 15 : isTablet ? 20 : 17,

    // Helper functions
    wp,
    hp,
  };
};

/**
 * Example usage in component:
 * 
 * const FaceGuideComponent = () => {
 *   const dimensions = useFaceGuideDimensions();
 *   
 *   return (
 *     <View style={{ width: dimensions.guideWidth, height: dimensions.guideHeight }}>
 *       <View style={{
 *         position: 'absolute',
 *         top: dimensions.topPosition,
 *         left: dimensions.horizontalMargin,
 *         width: dimensions.cornerWidth,
 *         height: dimensions.cornerHeight,
 *         borderTopWidth: dimensions.borderWidth,
 *         borderLeftWidth: dimensions.borderWidth,
 *       }} />
 *     </View>
 *   );
 * };
 */
