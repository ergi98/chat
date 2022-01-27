import UserSchema from "../schemas/user.schema.js";
import RoomSchema from "../schemas/room.schema.js";
import { createToken } from "../services/token.service.js";

export default class UserController {
  static async createUser(req, res) {
    try {
      const user = await UserSchema.create({
        roomId: req.body.roomId,
      });
      let token = createToken(user._doc);
      res.status(200).send({ user, token });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem with creating the user" });
    }
  }

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
}
