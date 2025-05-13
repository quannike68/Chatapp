
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:5001";
let socket: Socket | null = null;

export const connectSocket = (userId: string, onOnlineUsers: (users: any[]) => void ,  onNewMessage?: (message: any) => void) => {
  if (socket) return;

  socket = io(BASE_URL, {
    query: { userId },
  });

  socket.on("getOnlineUsers", (users) => {
    onOnlineUsers(users);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("newMessage", (message) => {
    if (onNewMessage) {
      onNewMessage(message);
    }
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendSocketMessage = (message: any) => {
  if (socket) socket.emit("sendMessage", message);
};


export const getSocket = (): Socket | null => socket;
