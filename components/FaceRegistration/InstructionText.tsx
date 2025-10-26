import { renderpose } from "@/utils/faceRecognitionUtils";
import { StyleSheet, Text, View } from "react-native";

interface InstructionTextProps {
  missingPose: any[];
}

export const InstructionText = ({ missingPose }: InstructionTextProps) => {
  return (
    <View style={styles.textContainer}>
      {missingPose.length > 0 ? (
        <Text style={styles.modernInstructionText}>
          {"Hãy " + renderpose(missingPose[0]) + " để chụp ảnh"}
        </Text>
      ) : (
        <Text style={styles.modernInstructionText}>
          Bạn đã đăng ký đầy đủ hình ảnh
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 30,
  },
  modernInstructionText: {
    color: "#292834",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: "10%",
  },
});
