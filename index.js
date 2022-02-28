import "dotenv/config";
import cors from "cors";
import express from "express";

import { dirname } from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";

// Socket
import { Server } from "socket.io";

// Mongoose
import mongoose from "mongoose";

// Routes
import userRouter from "./routes/user.routes.js";
import roomRouter from "./routes/room.routes.js";
import messageRouter from "./routes/message.routes.js";
import uploadRouter from "./routes/upload.routes.js";

// Services
import { decodeToken } from "./services/token.service.js";

// const options = {
//   key: readFileSync("./client/certs/key.pem"),
//   cert: readFileSync("./client/certs/cert.pem"),
// };

const app = express();
// const server = createServer(options, app);
const server = createServer(app);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .catch((err) => console.log(err));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(cors());
app.use(express.json());

app.use("/images", express.static("images"));
app.use("/audio", express.static("audio"));

app.use("/", userRouter);
app.use("/", roomRouter);
app.use("/", messageRouter);
app.use("/", uploadRouter);

io.on("connection", (socket) => {
  socket.on("new-member", (jwt) => {
    let decodedToken = decodeToken(`Bearer ${jwt}`);
    if (decodedToken) {
      socket.join(decodedToken.roomId);
      socket.broadcast.to(decodedToken.roomId).emit("new-member", decodedToken);
    }
  });
  socket.on("left-chat", (data) => {
    socket.broadcast.to(data.roomId).emit("left-chat");
  });
  socket.on("sent-message", (message) => {
    io.to(message.roomId).emit("new-message", message);
  });
  socket.on("typing", (data) => {
    socket.broadcast.to(data.room).emit("typing", data.user);
  });
  socket.on("finished-typing", (data) => {
    socket.broadcast.to(data.room).emit("finished-typing", data.user);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
