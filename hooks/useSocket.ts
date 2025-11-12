import { store } from "@/lib/store";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Singleton socket instance
let socketInstance: Socket | null = null;
let currentToken: string | null = null;

const createSocket = (token: string): Socket => {
  // If socket exists and token hasn't changed, return existing socket
  if (socketInstance && currentToken === token && socketInstance.connected) {
    return socketInstance;
  }

  // Disconnect old socket if it exists
  if (socketInstance) {
    console.log("Disconnecting old socket instance");
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  }

  // Create new socket
  console.log("Creating new socket instance");
  currentToken = token;

  const socket = io("https://faceattendance.dev", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    query: { provider: "face" },
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("✅ WebSocket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ WebSocket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("🔌 WebSocket disconnected:", reason);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log(`🔄 WebSocket reconnect attempt ${attempt}`);
  });

  socket.on("reconnect", () => {
    console.log("✅ WebSocket reconnected successfully");
  });

  socketInstance = socket;
  return socket;
};

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = store.getState().auth.accessToken;

  useEffect(() => {
    if (!token) {
      console.log("⚠️ No token available for socket connection");
      return;
    }

    // Create or get existing socket
    const newSocket = createSocket(token);
    setSocket(newSocket);

    // Cleanup function - DON'T disconnect, just remove local reference
    return () => {
      console.log("Component unmounting, but keeping socket alive");
    };
  }, [token]);

  return socket;
};

// Export function to manually disconnect socket (e.g., on logout)
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log("🔌 Manually disconnecting socket");
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
    currentToken = null;
  }
};

export default useSocket;
