import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
};
