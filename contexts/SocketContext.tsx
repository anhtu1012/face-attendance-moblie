import { store } from "@/lib/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Singleton socket instance
let socketInstance: Socket | null = null;
let currentToken: string | null = null;

const createSocket = (token: string): Socket => {
  // If socket exists and token hasn't changed, return existing socket
  if (socketInstance && currentToken === token && socketInstance.connected) {
    console.log("♻️ Reusing existing socket instance");
    return socketInstance;
  }

  // Disconnect old socket if it exists
  if (socketInstance) {
    console.log("🔌 Disconnecting old socket instance");
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  }

  // Create new socket
  console.log("🆕 Creating new socket instance");
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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = store.getState().auth.accessToken;

  useEffect(() => {
    if (!token) {
      console.log("⚠️ No token available for socket connection");
      return;
    }

    // Create or get existing socket
    const newSocket = createSocket(token);
    setSocket(newSocket);

    // Track connection status
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);

    // Set initial connection state
    setIsConnected(newSocket.connected);

    // Cleanup function - DON'T disconnect, just remove listeners
    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket
export const useSocket = (): Socket | null => {
  const { socket } = useContext(SocketContext);
  return socket;
};

// Custom hook to use socket with connection status
export const useSocketWithStatus = (): SocketContextType => {
  return useContext(SocketContext);
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
