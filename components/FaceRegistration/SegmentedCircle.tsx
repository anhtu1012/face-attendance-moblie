import { StyleSheet, Text, View } from "react-native";
import { FaceGuide } from "./FaceGuideoverlay.styles";

const SegmentedCircle = () => {
  return (
    <View style={styles.container}>
      <Text></Text>
    </View>
  );
};

export default SegmentedCircle;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: FaceGuide.top,
    width: FaceGuide.width,
    height: FaceGuide.height,
    borderBottomWidth: FaceGuide.borderVerticalWidth,
    borderRightWidth: FaceGuide.borderHorizontalWidth,
    borderColor: "green",
  },
});
