import { Entypo, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const CustomDrawer = ({
  state,
  navigation,
  descriptors,
}: DrawerContentComponentProps) => {
  // const { notificationCount } = useNotigation();
  const notificationCount = 0; // Temporary placeholder

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/login" as any);
    } catch (error: any) {
      console.error("Error clearing AsyncStorage during logout:", error);
      router.replace("/login" as any);
    }
  }, []);
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Text
        style={{
          paddingLeft: 16,
          paddingBottom: 16,
          marginBottom: 30,
          fontSize: 20,
          fontWeight: "bold",
          color: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        AttendEase
      </Text>

      <Pressable
        onPress={() => router.push("/(drawer)/(tabs)" as any)}
        style={styles.itemContainer}
      >
        <Feather name="home" size={24} color="white" />
        <Text style={{ fontSize: 16, color: "white" }}>Trang chủ</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(drawer)/chat" as any)}
        style={styles.itemContainer}
      >
        <Entypo name="chat" size={24} color="white" />
        <Text style={{ fontSize: 16, color: "white" }}>Chat App</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(drawer)/(tabs)/profile" as any)}
        style={styles.itemContainer}
      >
        <Feather name="user" size={24} color="white" />
        <Text style={{ fontSize: 16, color: "white" }}>Thông tin nhân sự</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(drawer)/face-register" as any)}
        style={styles.itemContainer}
      >
        <FontAwesome6 name="face-meh-blank" size={24} color="white" />
        <Text style={{ fontSize: 16, color: "white" }}>Đăng ký khuôn mặt</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(drawer)/notifications" as any)}
        style={styles.itemContainer}
      >
        <Ionicons name="notifications" size={24} color="white" />
        <Text style={{ fontSize: 16, color: "white" }}>Thông báo</Text>
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
};

export default CustomDrawer;

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
