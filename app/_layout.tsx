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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ErrorBoundary from "../components/ErrorBoundary";
import { useColorScheme } from "../hooks/use-color-scheme";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { persistor, store } from "../lib/store";
// import { NotificationProvider } from '@/contexts/NotificationContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox } from "react-native";
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "login",
};

export default function RootLayout() {
  if (__DEV__) {
    require("../ReactotronConfig");
  }
  LogBox.ignoreLogs([
    "expo-notifications: Android Push notifications",
    "functionality provided by expo-notifications was removed from Expo Go",
  ]);

  const colorScheme = useColorScheme();
  const { expoPushToken, notification } = usePushNotifications();
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
    <SafeAreaProvider>
      {/*
      <ErrorBoundary>
      */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
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
          </QueryClientProvider>
        </PersistGate>
      </Provider>
      {/*
      </ErrorBoundary>
      */}
    </SafeAreaProvider>
  );
}
