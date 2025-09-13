import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatAppPage() {
  const insets = useSafeAreaInsets();

  const chatRooms = [
    {
      id: "1",
      name: "Nhóm HR",
      lastMessage: "Thông báo về chính sách mới",
      time: "10:30",
      unread: 2,
    },
    {
      id: "2",
      name: "Nhóm IT Support",
      lastMessage: "Hệ thống sẽ bảo trì vào cuối tuần",
      time: "09:15",
      unread: 0,
    },
    {
      id: "3",
      name: "Nhóm Dự án Alpha",
      lastMessage: "Cập nhật tiến độ dự án",
      time: "Hôm qua",
      unread: 5,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#3674B5", "#2196F3"]} style={styles.header}>
        <Text style={styles.headerTitle}>Chat App</Text>
        <Text style={styles.headerSubtitle}>Kết nối với đồng nghiệp</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Cuộc trò chuyện gần đây</Text>

        {chatRooms.map((room) => (
          <TouchableOpacity key={room.id} style={styles.chatRoomCard}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#4CAF50", "#45a049"]}
                style={styles.avatar}
              >
                <MaterialIcons name="group" size={24} color="#fff" />
              </LinearGradient>
            </View>

            <View style={styles.chatRoomContent}>
              <View style={styles.chatRoomHeader}>
                <Text style={styles.chatRoomName}>{room.name}</Text>
                <Text style={styles.chatRoomTime}>{room.time}</Text>
              </View>
              <View style={styles.chatRoomFooter}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {room.lastMessage}
                </Text>
                {room.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{room.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.newChatButton}>
          <LinearGradient
            colors={["#2196F3", "#1976D2"]}
            style={styles.newChatButtonGradient}
          >
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={styles.newChatButtonText}>
              Tạo cuộc trò chuyện mới
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  chatRoomCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  chatRoomContent: {
    flex: 1,
  },
  chatRoomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chatRoomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  chatRoomTime: {
    fontSize: 12,
    color: "#666",
  },
  chatRoomFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  newChatButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  newChatButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  newChatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
