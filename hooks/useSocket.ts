import { store } from "@/lib/store";
import { useMemo } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (): Socket => {
  const token = store.getState().auth.accessToken;

  const socket = useMemo(() => {
    const s = io("https://faceattendance.dev", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 300,
      query: { provider: "face" },
      auth: {
        token: token,
      },
    });
    console.log(process.env.NEXT_PUBLIC_SOCKET_URL);

    s.on("connect", () => {
      console.log("WebSocket connected:", s.id);
    });

    s.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    s.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });

    s.on("reconnect_attempt", (attempt) => {
      console.log(`WebSocket reconnect attempt ${attempt}`);
    });

    s.on("reconnect", () => {
      console.log("WebSocket reconnected successfully");
    });

    return s;
  }, [token]);

  return socket;
};

export default useSocket;
