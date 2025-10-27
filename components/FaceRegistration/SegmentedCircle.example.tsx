import React from "react";
import { View, StyleSheet } from "react-native";
import SegmentedCircle from "./SegmentedCircle";

/**
 * Example usage of SegmentedCircle component
 */
export const SegmentedCircleExamples = () => {
  return (
    <View style={styles.container}>
      {/* Example 1: Default dotted circle (32 segments) */}
      <SegmentedCircle />

      {/* Example 2: Custom color and stroke width */}
      <SegmentedCircle 
        defaultColor="#FF5722" 
        defaultStrokeWidth={6}
      />

      {/* Example 3: Larger radius */}
      <SegmentedCircle 
        radius={150} 
        defaultColor="#2196F3"
      />

      {/* Example 4: Custom segments with individual control */}
      <SegmentedCircle
        segments={[
          // Top segment - green and thick
          { startAngle: 0, endAngle: 30, color: "#4CAF50", strokeWidth: 6 },
          // Gap
          { startAngle: 40, endAngle: 70, color: "#4CAF50", strokeWidth: 4 },
          
          // Right segment - blue
          { startAngle: 80, endAngle: 110, color: "#2196F3", strokeWidth: 5 },
          { startAngle: 120, endAngle: 150, color: "#2196F3", strokeWidth: 4 },
          
          // Bottom segment - orange
          { startAngle: 160, endAngle: 190, color: "#FF9800", strokeWidth: 5 },
          { startAngle: 200, endAngle: 230, color: "#FF9800", strokeWidth: 4 },
          
          // Left segment - red
          { startAngle: 240, endAngle: 270, color: "#F44336", strokeWidth: 5 },
          { startAngle: 280, endAngle: 310, color: "#F44336", strokeWidth: 4 },
          
          // Complete the circle
          { startAngle: 320, endAngle: 350, color: "#4CAF50", strokeWidth: 4 },
        ]}
      />

      {/* Example 5: Progress indicator style */}
      <SegmentedCircle
        segments={[
          // Completed segments (green)
          ...Array.from({ length: 12 }, (_, i) => ({
            startAngle: i * 10,
            endAngle: i * 10 + 8,
            color: "#4CAF50",
            strokeWidth: 5,
          })),
          // Remaining segments (gray)
          ...Array.from({ length: 24 }, (_, i) => ({
            startAngle: 120 + i * 10,
            endAngle: 120 + i * 10 + 8,
            color: "#E0E0E0",
            strokeWidth: 3,
            opacity: 0.5,
          })),
        ]}
      />

      {/* Example 6: Pulsing effect with opacity */}
      <SegmentedCircle
        segments={Array.from({ length: 16 }, (_, i) => ({
          startAngle: i * 22.5,
          endAngle: i * 22.5 + 18,
          color: "#9C27B0",
          strokeWidth: 4,
          opacity: 0.3 + (i / 16) * 0.7, // Gradient opacity effect
        }))}
      />

      {/* Example 7: Alternating colors */}
      <SegmentedCircle
        segments={Array.from({ length: 24 }, (_, i) => ({
          startAngle: i * 15,
          endAngle: i * 15 + 12,
          color: i % 2 === 0 ? "#00BCD4" : "#FFC107",
          strokeWidth: i % 2 === 0 ? 5 : 3,
        }))}
      />

      {/* Example 8: Sparse segments (clock-like) */}
      <SegmentedCircle
        segments={Array.from({ length: 12 }, (_, i) => ({
          startAngle: i * 30 - 2,
          endAngle: i * 30 + 2,
          color: i % 3 === 0 ? "#F44336" : "#4CAF50", // Red at 12, 3, 6, 9
          strokeWidth: i % 3 === 0 ? 8 : 5,
        }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
