import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SegmentConfig {
  startAngle: number;
  endAngle: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}

interface SegmentedCircleProps {
  segments?: SegmentConfig[];
  radius?: number;
  defaultColor?: string;
  defaultStrokeWidth?: number;
}

const SegmentedCircle: React.FC<SegmentedCircleProps> = ({
  segments,
  radius = 112,
  // defaultColor = "#44ce71",
  defaultColor = "#709ED4",
  defaultStrokeWidth = 4,
}) => {
  // Default segments if none provided - creates a dotted circle effect
  const defaultSegments: SegmentConfig[] = Array.from(
    { length: 32 },
    (_, i) => ({
      startAngle: i * (360 / 32),
      endAngle: i * (360 / 32) + (360 / 32) * 0.6, // 60% filled, 40% gap
    }),
  );

  const segmentsToRender = segments || defaultSegments;

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

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const centerX = radius;
  const centerY = radius;

  return (
    <View style={[styles.container, { width: radius * 2, height: radius * 2 }]}>
      <Svg width={radius * 2} height={radius * 2}>
        {segmentsToRender.map((segment, index) => (
          <Path
            key={index}
            d={describeArc(
              centerX,
              centerY,
              radius - (segment.strokeWidth || defaultStrokeWidth) / 2,
              segment.startAngle,
              segment.endAngle,
            )}
            stroke={segment.color || defaultColor}
            strokeWidth={segment.strokeWidth || defaultStrokeWidth}
            fill="none"
            opacity={segment.opacity || 1}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
};

export default SegmentedCircle;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "24.9%",
    left: "18.8%",
    zIndex: 99,
  },
});
