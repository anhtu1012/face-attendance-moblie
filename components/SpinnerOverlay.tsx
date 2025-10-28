import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal, Text } from "react-native";

interface LoaderOverlayProps {
  visible: boolean;
  content: string;
}

const SpinnerOverlay = ({ visible, content }: LoaderOverlayProps) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={"#3674B5"} />
        <Text style={styles.text}>{content}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
  },
});

export default SpinnerOverlay;
