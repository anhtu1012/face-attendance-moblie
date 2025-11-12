import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useColorScheme } from "../hooks/use-color-scheme";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { persistor, store } from "../lib/store";
// import { NotificationProvider } from '@/contexts/NotificationContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/CustomToast";
import useSocket from "@/hooks/useSocket";
import { dtoSocketNotification } from "@/models/socket/dtoSocketNotification";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "login",
};

// Component that uses push notifications (must be inside Redux Provider)
function AppContent() {
  const colorScheme = useColorScheme();
  const { expoPushToken, notification, isTokenRegistered } =
    usePushNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log("📱 Push Token:", expoPushToken.data ?? "");
      console.log("✅ Token registered with backend:", isTokenRegistered);
    }

    if (notification) {
      const data = JSON.stringify(notification, undefined, 2);
      console.log("📬 Notification Data:", data);
    }
  }, [expoPushToken, notification, isTokenRegistered]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#ffffff" }}
          edges={["top", "left", "right", "bottom"]}
        >
          <Stack>
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(drawer)"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="timesheet"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="form-detail"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="form-list"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="form-detail-view"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
          </Stack>
        </SafeAreaView>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  if (__DEV__) {
    require("../ReactotronConfig");
  }
  LogBox.ignoreLogs([
    "expo-notifications: Android Push notifications",
    "functionality provided by expo-notifications was removed from Expo Go",
  ]);

  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { expoPushToken, notification } = usePushNotifications();
  const socket = useSocket();

  // Socket listener effect
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not available");
      return;
    }

    console.log(
      "🔌 Setting up socket listener for UPDATE_FORM_STATUS_NOTIFICATION",
    );

    const handleGetSocketData = (data: dtoSocketNotification) => {
      console.log("📨 Socket message received:", data);
      Toast.show({
        type: "info",
        text1: "Thông báo",
        text2: data.description,
        topOffset: insets.top + 10,
      });
    };

    // Add listener
    socket.on("NOTIFICATION_SENT", handleGetSocketData);

    // Cleanup listener on unmount
    return () => {
      console.log("🧹 Cleaning up socket listener");
      socket.off("NOTIFICATION_SENT", handleGetSocketData);
    };
  }, [socket]); // Add refetch to dependencies

  useEffect(() => {
    if (expoPushToken) {
      console.log("Token: ", expoPushToken.data ?? "");
    }

    if (notification) {
      const data = JSON.stringify(notification, undefined, 2);
      console.log("Data: ", data);
    }
  }, [expoPushToken, notification]);
  const queryClient = new QueryClient();

  return (
    <>
      <SafeAreaProvider>
        <SystemBars style="dark" />
        {/*
      <ErrorBoundary>
      */}
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <AppContent />
            </QueryClientProvider>
          </PersistGate>
        </Provider>
        {/* Toast component - must be rendered at root level */}
        <Toast config={toastConfig} />
        {/*
      </ErrorBoundary>
      */}
      </SafeAreaProvider>
    </>
  );
}
