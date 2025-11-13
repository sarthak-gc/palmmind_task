import { Server } from "socket.io";

const users = new Map<string, string>(); // userId : socketId
export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    // console.log("user connected:", socket.id);

    socket.on("successful_login", ({ userId }) => {
      users.set(userId, socket.id);
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
        broadcastNewMessage(io, message, senderId, receiverId);
      }
    );

    socket.on("disconnect", () => {
      // console.log("user disconnected:", socket.id);
      // users.forEach((user) => {});
    });
    // console.log(users);
  });
};

const broadcastNewMessage = async (
  io: Server,
  message: string,
  senderId: string,
  receiverId: string
) => {
  const targetSocketId = users.get(receiverId);

  // console.log("targetSocketId", targetSocketId);
  if (targetSocketId) {
    io.to(targetSocketId).emit("msg_sent", { message, senderId });
  } else {
    // console.log("Receiver is not online");
  }
};
