import { updateUserPushToken } from "@/api/user";
import { RootState } from "@/lib/store";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
  isTokenRegistered?: boolean;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: false,
    }),
  });
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const [isTokenRegistered, setIsTokenRegistered] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Get userId and accessToken from Redux store (must be at top level)
  const userId = useSelector(
    (state: RootState) => state?.auth?.userProfile?.id
  );
  const accessToken = useSelector(
    (state: RootState) => state?.auth?.accessToken
  );

  async function registerForPushNotificationAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("❌ Permission not granted for push notifications");
        return null;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      return token;
    } else {
      console.log("⚠️ Must use physical device for Push Notifications");
      return null;
    }
  }

  // Register push token with backend
  async function registerTokenWithBackend(
    token: Notifications.ExpoPushToken,
    userId: string
  ) {
    try {
      console.log("📱 Registering push token with backend...");
      await updateUserPushToken(userId, token.data);
      console.log("✅ Push token registered successfully with user:", userId);
      setIsTokenRegistered(true);
    } catch (error) {
      console.error("❌ Failed to register push token:", error);
      setIsTokenRegistered(false);
    }
  }
  // Effect 1: Get push token and setup notification listeners (runs once)
  useEffect(() => {
    registerForPushNotificationAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
          console.log("📱 Expo Push Token:", token.data);
        }
      })
      .catch((error) => {
        console.error("❌ Error getting push token:", error);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📬 Notification received:", notification);
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Effect 2: Update backend when all conditions are met (runs on login/rehydrate)
  useEffect(() => {
    console.log("🔍 Checking conditions:", {
      hasToken: !!expoPushToken,
      hasUserId: !!userId,
      hasAccessToken: !!accessToken,
    });

    if (expoPushToken && userId && accessToken) {
      console.log("✅ All conditions met! Updating backend...");
      registerTokenWithBackend(expoPushToken, userId);
    } else {
      console.log("⏳ Waiting for Redux to rehydrate...");
    }
  }, [expoPushToken, userId, accessToken]);

  return {
    expoPushToken,
    notification,
    isTokenRegistered,
  };
};
