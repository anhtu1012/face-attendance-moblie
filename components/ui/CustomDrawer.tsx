import { Entypo, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DrawerContentComponentProps,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from "react-native-reanimated";

const useAnimatedItemStyle = (
  shared: Animated.SharedValue<number>,
  index: number,
) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shared.value, [0, 1], [-80 * (index + 1), 0]),
      },
    ],
    opacity: interpolate(shared.value, [0, 1], [0, 1]),
  }));
};

const CustomDrawer = ({ navigation, state }: DrawerContentComponentProps) => {
  const isOpen = useDrawerStatus() === "open";

  // Shared animation value
  const distance = useSharedValue(0);

  // Animate items when drawer opens
  useEffect(() => {
    distance.value = withSpring(isOpen ? 1 : 0, {
      damping: 15,
      stiffness: 120,
      mass: 1,
      // duration: 1000,
    });
  }, [isOpen]);

  // Animated styles for each menu item
  const animatedStyles = state.routes.map((_, index) =>
    useAnimatedItemStyle(distance, index),
  );

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/login" as any);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AttendEase</Text>

      {/* Drawer Items */}
      {[
        {
          label: "Trang chủ",
          icon: <Feather name="home" size={24} color="#fff" />,
          route: "/(drawer)/(tabs)",
        },
        {
          label: "Chat App",
          icon: <Entypo name="chat" size={24} color="#fff" />,
          route: "/(drawer)/chat",
        },
        {
          label: "Thông tin nhân sự",
          icon: <Feather name="user" size={24} color="#fff" />,
          route: "/(drawer)/(tabs)/profile",
        },
        {
          label: "Đăng ký khuôn mặt",
          icon: <FontAwesome6 name="face-meh-blank" size={24} color="#fff" />,
          route: "/(drawer)/face-register",
        },
        {
          label: "Thông báo",
          icon: <Ionicons name="notifications" size={24} color="#fff" />,
          route: "/(drawer)/notifications",
        },
      ].map((item, index) => (
        <Animated.View key={index} style={animatedStyles[index]}>
          <Pressable
            onPress={() => router.push(item.route as any)}
            style={styles.itemContainer}
          >
            {item.icon}
            <Text style={styles.itemText}>{item.label}</Text>
          </Pressable>
        </Animated.View>
      ))}

      {/* Logout Button */}
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  title: {
    paddingBottom: 16,
    marginBottom: 30,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: { fontSize: 16, color: "white" },
  logoutButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#3674B5",
    borderRadius: 8,
    alignSelf: "center",
    width: 200,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
