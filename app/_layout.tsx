import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ErrorBoundary from "@/components/ErrorBoundary";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../lib/store";
// import { NotificationProvider } from '@/contexts/NotificationContext';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "login",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ErrorBoundary>
              {/* <NotificationProvider> */}
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
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
                <StatusBar style="auto" />
              </ThemeProvider>
              {/* </NotificationProvider> */}
            </ErrorBoundary>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
