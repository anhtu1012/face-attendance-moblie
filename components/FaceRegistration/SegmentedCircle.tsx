import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SegmentConfig {
  startAngle: number;
  endAngle: number;
  color?: string;
  innerRadius?: number;
  outerRadius?: number;
  opacity?: number;
}

interface SegmentedCircleProps {
  segments?: SegmentConfig[];
  radius?: number;
  defaultColor?: string;
  currentPose: number | null;
  currentMissingPose: number | undefined;
}

const SegmentedCircle: React.FC<SegmentedCircleProps> = ({
  segments,
  radius = 112,
  defaultColor = "#709ED4",
  currentPose,
  currentMissingPose,
}) => {
  const [highlightedSegments, setHighlightedSegments] = useState<number[]>([]);
  const [segmentRadii, setSegmentRadii] = useState<{ [key: number]: number }>(
    {},
  );
  const animationFrames = useRef<{ [key: number]: number }>({});

  const defaultSegments: SegmentConfig[] = Array.from(
    { length: 36 },
    (_, i) => ({
      startAngle: i * (360 / 36),
      endAngle: i * (360 / 36) + (360 / 36) * 0.7,
      innerRadius: radius - 5,
      outerRadius: radius,
    }),
  );

  const segmentsToRender = segments || defaultSegments;

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      Object.values(animationFrames.current).forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
    };
  }, []);

  // Animate segment radius
  const animateSegment = (segmentIndex: number) => {
    const startRadius = radius;
    const endRadius = radius + 40;
    const duration = 500; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRadius = startRadius + (endRadius - startRadius) * easeOut;

      setSegmentRadii((prev) => ({
        ...prev,
        [segmentIndex]: currentRadius,
      }));

      if (progress < 1) {
        animationFrames.current[segmentIndex] = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // Calculate the maximum outer radius considering all potential values
  // including any hardcoded increases in rendering (like radius + 20 for index === 1)
  const maxOuterRadius = Math.max(
    radius + 40, // Account for animated radius
    ...segmentsToRender.map((s) => s.outerRadius ?? radius),
  );

  // Add padding to accommodate larger segments
  const containerSize = maxOuterRadius * 2 + 40; // Increased padding for safety
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const renderHighlightedSegment = (currentSegment: number, outerR: number) => {
    // Check if currentSegment is in highlightedSegments
    if (highlightedSegments.includes(currentSegment)) {
      return segmentRadii[currentSegment] ?? radius + 40;
    }

    // Check if currentPose is the same as missing pose
    if (currentPose !== currentMissingPose) return outerR;

    // Check if currentSegment includes in any pose
    if (
      (currentPose === 0 && currentSegment >= 18 && currentSegment <= 23) ||
      (currentPose === 1 && currentSegment >= 24 && currentSegment <= 29) ||
      (currentPose === 2 && currentSegment >= 30 && currentSegment <= 35) ||
      (currentPose === 3 && currentSegment >= 0 && currentSegment <= 5) ||
      (currentPose === 4 && currentSegment >= 6 && currentSegment <= 11) ||
      (currentPose === 5 && currentSegment >= 12 && currentSegment <= 23)
    ) {
      if (!highlightedSegments.includes(currentSegment)) {
        setHighlightedSegments((prev) => [...prev, currentSegment]);
        animateSegment(currentSegment);
      }
      return segmentRadii[currentSegment] ?? radius;
    }
    return outerR;
  };

  const renderSegmentColor = (currentSegment: number) => {
    if (highlightedSegments.includes(currentSegment)) return "#709ED4";
    return "#918784";
  };

  const describeDonutSegment = (
    x: number,
    y: number,
    innerR: number,
    outerR: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const startOuter = polarToCartesian(x, y, outerR, startAngle);
    const endOuter = polarToCartesian(x, y, outerR, endAngle);
    const startInner = polarToCartesian(x, y, innerR, endAngle);
    const endInner = polarToCartesian(x, y, innerR, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}
      Z
    `;
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerSize, height: containerSize },
      ]}
    >
      <Svg width="100%" height="100%" style={{ overflow: "visible" }}>
        {segmentsToRender.map((segment, index) => {
          const innerR = segment.innerRadius ?? radius - 8;
          const outerR = segment.outerRadius ?? radius;

          return (
            <Path
              key={index}
              d={describeDonutSegment(
                centerX,
                centerY,
                innerR,
                renderHighlightedSegment(index, outerR),
                segment.startAngle,
                segment.endAngle,
              )}
              fill={renderSegmentColor(index)}
              opacity={segment.opacity || 1}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default SegmentedCircle;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "17%",
    left: "2.4%",
    zIndex: 99,
    overflow: "visible", // Allow content to overflow without clipping
  },
});
