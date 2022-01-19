import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";

import { fileURLToPath } from "url";
import { dirname } from "path";

// Socket
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

io.on("connection", (socket) => {
  socket.on("connected", (data) => {
    console.log("user connected", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("send-message", (message) => {
    message.sentAt = new Date();
    io.emit("message", message);
  });
  // socket.on("read", (message, member) => {
  //   message.sentAt = new Date();
  //   socket.emit("message", message);
  // });
  // socket.on("typing", (member) => {
  //   message.sentAt = new Date();
  //   socket.emit("message", message);
  // });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
