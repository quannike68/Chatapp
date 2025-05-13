import { Server } from "socket.io";
import User from "./model/user.model.js";

const onlineUsers = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    onlineUsers.set(userId, socket.id);
    await emitOnlineUsers(io);

    socket.on("sendMessage", async (messageData) => {
      const { receiverId } = messageData;
      const receiverSocketId = onlineUsers.get(receiverId);
      // console.log("Gửi newMessage tới:", receiverId, "socketId:", receiverSocketId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", messageData);
      }
    });


    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await emitOnlineUsers(io);
    });
  });
};


const emitOnlineUsers = async (io) => {
  try {
    const ids = Array.from(onlineUsers.keys());
    const users = await User.find({ _id: { $in: ids } }).select("-password");
    io.emit("getOnlineUsers", users);
  } catch (err) {
    console.error("Error emitting online users:", err.message);
  }
};

export default initSocket;
