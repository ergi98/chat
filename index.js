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

import { validateToken, decodeToken } from "./services/token.service.js";

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
      let { isValid, error } = await validateToken(req.headers.authorization);
      if (isValid) {
        let decodedToken = decodeToken(req.headers.authorization);
        req.headers.user = decodedToken._id;
        req.headers.room = decodedToken.roomId;
        next();
      } else {
        if (error && error.name === "TokenExpiredError") {
          res.status(400).send({
            type: "token_refresh",
            message: "Current token has expired",
          });
        } else
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
app.use("/", messageRouter);

io.on("connection", (socket) => {
  socket.on("new-member", (jwt) => {
    let decodedToken = decodeToken(`Bearer ${jwt}`);
    if (decodedToken) {
      socket.join(decodedToken.roomId);
      io.to(decodedToken.roomId).emit("new-member", decodedToken);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("sent-message", (message) => {
    io.emit("new-message", message);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
