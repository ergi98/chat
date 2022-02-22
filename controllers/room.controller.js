import RoomSchema from "../schemas/room.schema.js";
import UserSchema from "../schemas/user.schema.js";

import mongoose from "mongoose";
export default class RoomController {
  static async createRoom(req, res) {
    try {
      const room = await RoomSchema.create({});
      res.status(200).send({ room });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "An error occurred while creating your room" });
    }
  }

  static async getRoom(req, res) {
    try {
      const roomData = await RoomSchema.findById(req.headers.room);
      res.status(200).send({ roomData });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "An error occurred while getting your room" });
    }
  }

  static async assignUserToRoom(req, res) {
    try {
      const roomData = await RoomSchema.findByIdAndUpdate(
        req.headers.room,
        {
          $addToSet: { members: req.headers.user },
        },
        { returnDocument: "after" }
      );
      res.status(200).send({ roomData });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "An error occurred while assigning you to this room",
      });
    }
  }

  static async removeFromRoom(req, res) {
    let session;
    try {
      session = await mongoose.startSession();

      await session.withTransaction(async () => {
        await RoomSchema.findByIdAndUpdate(req.headers.room, {
          $pull: { members: req.headers.user },
        });
        await UserSchema.findByIdAndDelete(req.headers.user);
      });
      res.status(200).send({ success: true });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "An error occurred while removing you from this room",
      });
    } finally {
      session.endSession();
    }
  }
}
