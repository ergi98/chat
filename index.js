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
import { validateToken, decodeToken } from "./services/token.service.js";

// var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
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

app.use(cors());
app.use(express.json());
app.use("/", async (req, res, next) => {
  try {
    if (
      ["/create-room", "/create-user"].includes(req.url) &&
      !req.headers.authorization
    ) {
      next();
    } else {
      let isValid = await validateToken(req.headers.authorization);
      if (isValid) {
        let decodedToken = decodeToken(req.headers.authorization);
        req.headers.user = decodedToken._id;
        req.headers.room = decodedToken.roomId;
        next();
      } else {
        res
          .status(500)
          .send({ message: "You do not have permissions for this action " });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
app.use("/", userRouter);
app.use("/", roomRouter);

// app.get("/", (req, res) => {
//   console.log(req);
//   res.sendFile(__dirname + "/client/index.html");
// });

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
