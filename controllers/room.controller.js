import RoomSchema from "../schemas/room.schema.js";

export default class RoomController {
  static async createRoom(req, res) {
    try {
      const room = await RoomSchema.create({});
      res.status(200).send({ room });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "There was an error creating room" });
    }
  }

  static async getRoom(req, res) {
    try {
      const roomData = await RoomSchema.findById(req.headers.room);
      res.status(200).send({ roomData });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "There was an error checking room" });
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
      res
        .status(400)
        .send({ message: "There was an error while assigning room" });
    }
  }
}
