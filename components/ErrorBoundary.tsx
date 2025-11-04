import { Feather } from "@expo/vector-icons";
import React, { Component, ReactNode } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRestart = () => {
    Alert.alert(
      "Khởi động lại ứng dụng",
      "Ứng dụng sẽ được khởi động lại để sửa lỗi. Vui lòng đóng và mở lại ứng dụng thủ công.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đóng ứng dụng",
          onPress: () => {
            // In React Native, we can't force close the app programmatically
            // The user needs to manually close and reopen the app
            console.log("User requested app restart");
          },
        },
      ],
    );
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorMessage = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
    `.trim();

    // You can implement your error reporting service here
    // For now, we'll just show an alert with the error details
    Alert.alert(
      "Báo cáo lỗi",
      "Lỗi đã được ghi nhận. Chúng tôi sẽ khắc phục sớm nhất có thể.",
      [
        { text: "Đóng", style: "cancel" },
        {
          text: "Gửi báo cáo",
          onPress: () => {
            // Here you can implement actual error reporting
            console.log("Error reported:", errorMessage);
            Alert.alert("Thành công", "Báo cáo lỗi đã được gửi!");
          },
        },
      ],
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <View style={styles.iconContainer}>
              <Feather name="alert-triangle" size={64} color="#E53E3E" />
            </View>

            <Text style={styles.title}>Ứng dụng gặp lỗi</Text>
            <Text style={styles.message}>
              Đã xảy ra lỗi không mong muốn. Vui lòng khởi động lại ứng dụng để
              tiếp tục sử dụng.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>
                  Chi tiết lỗi (Development):
                </Text>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
                {this.state.error.stack && (
                  <Text style={styles.errorStack}>
                    {this.state.error.stack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={this.handleRestart}
              >
                <Feather name="refresh-cw" size={20} color="#fff" />
                <Text style={styles.restartButtonText}>Khởi động lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportButton}
                onPress={this.handleReportError}
              >
                <Feather name="send" size={20} color="#3674B5" />
                <Text style={styles.reportButtonText}>Báo cáo lỗi</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helpText}>
              Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ kỹ thuật.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 400,
    width: "100%",
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  errorDetails: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: "100%",
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E53E3E",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 10,
    color: "#999",
    fontFamily: "monospace",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3674B5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3674B5",
    flex: 1,
    justifyContent: "center",
  },
  reportButtonText: {
    color: "#3674B5",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default ErrorBoundary;
