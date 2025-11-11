import http from "http";
import { Server } from "socket.io";
import app from "./app";
import "./config/db";
import { setupSocket } from "./config/socket";
import { PORT } from "./utils/constants";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
