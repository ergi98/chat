import mongoose from "mongoose";

// Schemas
import UserSchema from "../schemas/user.schema.js";
import RoomSchema from "../schemas/room.schema.js";

// Services
import { createToken, createRefreshToken } from "../services/token.service.js";

export default class UserController {
  // static async createUser(req, res) {
  //   try {
  //     let user, token, refreshToken;
  //     session = await mongoose.startSession();

  //     await session.withTransaction(async () => {
  //       user = await UserSchema.create({ roomId: req.body.roomId });

  //       token = createToken(user._doc);
  //       refreshToken = createRefreshToken(user._doc);

  //       await UserSchema.findByIdAndUpdate(user._doc._id, {
  //         $set: { refreshToken: refreshToken },
  //       });
  //     });

  //     res.status(200).send({ user, token, refreshToken });
  //   } catch (err) {
  //     console.log(err);
  //     res
  //       .status(400)
  //       .send({ message: "There was a problem with creating the user" });
  //   } finally {
  //     session.endSession();
  //   }
  // }

  static async getUser(req, res) {
    try {
      const user = await UserSchema.findById(req.headers.user);
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem while getting the user" });
    }
  }

  static async checkIfUserBelongsToRoom(req, res) {
    try {
      const user = await UserSchema.findById(req.headers.user);
      const room = await RoomSchema.findById(user.roomId);
      let belongs = room.members.includes(user.roomId);
      res.status(200).send({ belongs });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem while checking the user" });
    }
  }

  static async createUserAndAssignToRoom(req, res) {
    let session;
    try {
      let roomId = req.body.roomId;
      if (!roomId) throw new Error();

      let user, room, token, refreshToken;
      session = await mongoose.startSession();

      await session.withTransaction(async () => {
        let roomCount = await RoomSchema.count({
          _id: mongoose.Types.ObjectId(roomId),
        });
        // If room does not exist
        if (roomCount !== 1) throw new Error();
        user = await UserSchema.create({ roomId });

        token = createToken(user._doc);
        refreshToken = createRefreshToken(user._doc);

        await UserSchema.findByIdAndUpdate(user._doc._id, {
          $set: { refreshToken: refreshToken },
        });

        room = await RoomSchema.findByIdAndUpdate(
          roomId,
          {
            $addToSet: { members: user._doc._id },
          },
          { returnDocument: "after" }
        );
      });

      res.status(200).send({ user, token, room, refreshToken });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem while creating your user" });
    } finally {
      session.endSession();
    }
  }

  static async createUserAndRoom(req, res) {
    let session;
    try {
      let user, token, room, refreshToken;
      session = await mongoose.startSession();

      await session.withTransaction(async () => {
        // Creating room
        room = await RoomSchema.create({});
        // Creating user
        user = await UserSchema.create({ roomId: room._doc._id });

        token = createToken(user._doc);
        refreshToken = createRefreshToken(user._doc);

        await UserSchema.findByIdAndUpdate(user._doc._id, {
          $set: { refreshToken: refreshToken },
        });

        // Adding user to room
        room = await RoomSchema.findByIdAndUpdate(
          room._doc._id,
          {
            $addToSet: { members: user._doc._id },
          },
          { returnDocument: "after" }
        );
      });

      res.status(200).send({ user, token, refreshToken, room });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "There was a problem while we were setting things up",
      });
    } finally {
      session.endSession();
    }
  }
}
