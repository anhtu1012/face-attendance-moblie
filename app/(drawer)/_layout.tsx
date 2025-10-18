import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawer from "@/components/ui/CustomDrawer";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          drawerType: "slide",
          headerShown: false,
          overlayColor: "transparent",
          drawerStyle: {
            backgroundColor: "#3674B5",
            width: 250,
          },
          sceneStyle: {
            backgroundColor: "#3674B5",
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
      </Drawer>
    </GestureHandlerRootView>
  );
}
