import { store } from "@/lib/store";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { socketRoomManager } from "./socketRoomManager";

let socketInstance: Socket | null = null;
let isInitialized = false;
let socketUpdateListeners: ((socket: Socket | null) => void)[] = [];

// Notify all listeners when socket changes
const notifySocketUpdate = (socket: Socket | null) => {
  socketUpdateListeners.forEach(listener => listener(socket));
};

const createSocketInstance = (): Socket => {
  if (socketInstance) {
    return socketInstance;
  }

  const token = store.getState().auth.accessToken;
  console.log(
    "process.env.EXPO_PUBLIC_SOCKET_URL",
    process.env.EXPO_PUBLIC_SOCKET_URL
  );

  const s = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    query: { provider: "face" },
    auth: {
      token: `${token}`,
    },
  });

  // Khởi tạo Socket Room Manager CHỈ MỘT LẦN

  if (!isInitialized) {
    socketRoomManager.initialize(s);
    isInitialized = true;
  }

  s.on("connect_error", (error) => {
    console.error(" [useSocket] WebSocket connection error:", error.message);
  });

  s.on("disconnect", (reason) => {
    console.warn(" [useSocket] WebSocket disconnected:", reason);
  });

  s.on("reconnect_attempt", (attempt) => {
    console.log(` [useSocket] WebSocket reconnect attempt ${attempt}`);
  });

  s.on("reconnect", () => {
    console.log(" [useSocket] WebSocket reconnected successfully");
  });

  socketInstance = s;
  return s;
};

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(() => socketInstance || createSocketInstance());

  useEffect(() => {
    // Subscribe to socket updates
    const listener = (newSocket: Socket | null) => {
      console.log("[useSocket] Updating socket in component");
      setSocket(newSocket);
    };
    
    socketUpdateListeners.push(listener);

    return () => {
      // Unsubscribe on unmount
      socketUpdateListeners = socketUpdateListeners.filter(l => l !== listener);
    };
  }, []);

  return socket;
};

export default useSocket;

// Reconnect socket với token mới (sau khi login)
export const reconnectSocketWithNewToken = () => {
  if (socketInstance) {
    console.log("[useSocket] Reconnecting socket with new token...");

    // Disconnect socket hiện tại
    socketRoomManager.cleanup();
    socketInstance.disconnect();
    socketInstance = null;
    isInitialized = false;

    // Tạo lại socket instance với token mới
    const newSocket = createSocketInstance();

    // Notify all components using the socket
    notifySocketUpdate(newSocket);

    console.log("[useSocket] Socket reconnected with new token");
    return newSocket;
  } else {
    console.log("[useSocket] Creating new socket instance with token...");
    const newSocket = createSocketInstance();
    notifySocketUpdate(newSocket);
    return newSocket;
  }
};

// Cleanup function để gọi khi logout
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log("[useSocket] Disconnecting socket...");
    socketRoomManager.cleanup();
    socketInstance.disconnect();
    socketInstance = null;
    isInitialized = false;
    
    // Notify all components
    notifySocketUpdate(null);
    
    console.log("[useSocket] Socket disconnected and cleaned up");
  }
};
