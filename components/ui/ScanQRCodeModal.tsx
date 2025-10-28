import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScanQRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
  title?: string;
}

const ScanQRCodeModal: React.FC<ScanQRCodeModalProps> = ({
  visible,
  onClose,
  onScanSuccess,
  title = "Quét QR code trên CCCD",
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    onScanSuccess(data);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        />

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.qrFrame}>
          <View style={[styles.qrCorner, styles.qrCornerTopLeft]} />
          <View style={[styles.qrCorner, styles.qrCornerTopRight]} />
          <View style={[styles.qrCorner, styles.qrCornerBottomLeft]} />
          <View style={[styles.qrCorner, styles.qrCornerBottomRight]} />
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>
            Đặt mã QR trong khung để quét
          </Text>
          <Text style={styles.instructionSubtitle}>
            Đảm bảo mã QR rõ nét và nằm trong khung
          </Text>
        </View>
        <View style={styles.scanArea} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  closeButton: {
    marginRight: 50,
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  qrFrame: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  qrCorner: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  qrCornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: "white",
    borderLeftColor: "white",
  },
  qrCornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopColor: "white",
    borderRightColor: "white",
  },
  qrCornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomColor: "white",
    borderLeftColor: "white",
  },
  qrCornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomColor: "white",
    borderRightColor: "white",
  },
  instructionContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  instructionSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  scanArea: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    height: 300,
    backgroundColor: "transparent",
  },
});

export default ScanQRCodeModal;
