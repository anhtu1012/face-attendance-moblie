import { GradientProgress } from "@/components/ui/GradientProgress";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  missingPose: any[];
}

export const ProgressBar = ({ missingPose }: ProgressBarProps) => {
  return (
    <View style={styles.progressContainer}>
      <GradientProgress
        progress={(6 - missingPose.length) / 6}
        width={250}
        height={12}
        duration={600} // animation speed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
