import { Server } from "socket.io";
import { Message } from "../models/Message";

let totalMessages: number;
const getTotalMessageCnt = async () => {
  let totalChats = await Message.find({
    receiver: null,
  });
  totalMessages = totalChats.length;
};

const users = new Map<string, string>(); // userId : socketId
const onlineUsers = new Map<string, string>(); // userId : username

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    getTotalMessageCnt();
    socket.emit("total_cnt", totalMessages);
    socket.emit("online_users", Array.from(onlineUsers.values()));

    // console.log("user connected:", socket.id);
    socket.on("successful_login", ({ userId, username }) => {
      users.set(userId, socket.id);
      onlineUsers.set(userId, username);

      socket.data.username = username;
      socket.broadcast.emit("new_active", username);
      io.emit("total_cnt", totalMessages);
      io.emit("online_users", Array.from(onlineUsers.values()));
    });

    socket.on("successful_signup", ({ userId, username }) => {
      users.set(userId, socket.id);
      onlineUsers.set(userId, username);

      socket.data.username = username;
      socket.broadcast.emit("new_active", username);
      io.emit("total_cnt", totalMessages);
      io.emit("online_users", Array.from(onlineUsers.values()));
    });

    socket.on(
      "message",
      ({
        senderId,
        message,
        receiverId,
      }: {
        senderId: string;
        message: string;
        receiverId: string;
      }) => {
        broadcastNewMessage(
          io,
          message,
          senderId,
          receiverId,
          socket.data.username
        );
      }
    );
    socket.on(
      "global_message",
      ({ senderId, message }: { senderId: string; message: string }) => {
        totalMessages++;
        io.emit("total_cnt", totalMessages);
        socket.broadcast.emit("global_sent", {
          message,
          senderId,
          username: socket.data.username,
        });
      }
    );

    socket.on("disconnect", () => {
      users.forEach((socketId, userId) => {
        console.log(socketId, socket.id);
        if (socket.id == socketId) {
          onlineUsers.delete(userId);
          users.delete(userId);
          io.emit("new_offline", socket.data.username);
        }
      });
      io.emit("online_users", Array.from(onlineUsers.values()));
      // console.log(onlineUsers);
      console.log("user disconnected", socket.id);
    });
  });
};

const broadcastNewMessage = async (
  io: Server,
  message: string,
  senderId: string,
  receiverId: string,
  username: string
) => {
  const targetSocketId = users.get(receiverId);
  console.log(targetSocketId, "HERE");

  // console.log("targetSocketId", targetSocketId);
  if (targetSocketId) {
    io.to(targetSocketId).emit("msg_sent", { message, senderId, username });
  } else {
    // console.log("Receiver is not online");
  }
};
