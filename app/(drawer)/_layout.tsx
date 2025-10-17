import { Drawer } from "expo-router/drawer";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
// import { useNotification } from '@/contexts/NotificationContext';

export default function DrawerLayout() {
  // const { notificationCount } = useNotigation();
  const notificationCount = 0; // Temporary placeholder

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/login" as any);
    } catch (error: any) {
      console.error("Error clearing AsyncStorage during logout:", error);
      router.replace("/login" as any);
    }
  }, []);

  // Custom drawer content
  const renderDrawerContent = useCallback(
    (props: any) => {
      return (
        <View style={{ flex: 1, paddingTop: 50 }}>
          <Text
            style={{
              padding: 16,
              fontSize: 20,
              fontWeight: "bold",
              color: "#3674B5",
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              marginTop: 30,
            }}
          >
            HỆ THỐNG CHẤM CÔNG
          </Text>

          <Pressable
            onPress={() => router.push("/(drawer)/(tabs)" as any)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0f0" : "transparent",
              borderRadius: 8,
              padding: 16,
            })}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>Trang chủ</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(drawer)/chat" as any)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0f0" : "transparent",
              borderRadius: 8,
              padding: 16,
            })}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>Chat App</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(drawer)/(tabs)/profile" as any)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0f0" : "transparent",
              borderRadius: 8,
              padding: 16,
            })}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>
              Thông tin nhân sự
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(drawer)/face-register" as any)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0f0" : "transparent",
              borderRadius: 8,
              padding: 16,
            })}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>
              Đăng ký khuôn mặt
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(drawer)/notifications" as any)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0f0" : "transparent",
              borderRadius: 8,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            })}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>Thông báo</Text>
            {notificationCount > 0 && (
              <View
                style={{
                  backgroundColor: "#FF4444",
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {notificationCount > 99 ? "99+" : String(notificationCount)}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("testScreen" as any)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0f0" : "transparent",
              borderRadius: 8,
              padding: 16,
            })}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>test</Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              marginTop: 20,
              padding: 16,
              backgroundColor: pressed ? "tomato" : "#3674B5",
              borderRadius: 8,
              alignSelf: "center",
              width: 200,
            })}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Đăng xuất
            </Text>
          </Pressable>
        </View>
      );
    },
    [handleLogout, notificationCount],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={renderDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#fff",
            width: 280,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Trang chủ",
            title: "Trang chủ",
          }}
        />
        <Drawer.Screen
          name="chat"
          options={{
            drawerLabel: "Chat App",
            title: "Chat App",
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Thông tin cá nhân",
            title: "Thông tin cá nhân",
          }}
        />
        <Drawer.Screen
          name="(face)/face-register"
          options={{
            drawerLabel: "Đăng ký khuôn mặt",
            title: "Đăng ký khuôn mặt",
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerLabel: "Thông báo",
            title: "Thông báo",
          }}
        />
        <Drawer.Screen
          name="testScreen"
          options={{
            drawerLabel: "test",
            title: "test",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
