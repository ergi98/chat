import RoomSchema from "../schemas/room.schema.js";

export default class RoomController {
  static async createRoom(req, res) {
    try {
      const room = await RoomSchema.create({});
      res.status(200).send({ room });
    } catch (err) {
      res.status(400).send({ message: "There was an error creating room" });
    }
  }

  static async checkIfRoomExists(req, res) {
    try {
      const roomData = await RoomSchema.findById(req.query.roomId);
      res.status(200).send({ roomData });
    } catch (err) {
      res.status(400).send({ message: "There was an error checking room" });
    }
  }

  static async assignUserToRoom(req, res) {
    try {
      console.log(req.headers, "HERE");
      const roomData = await RoomSchema.findByIdAndUpdate(
        req.headers.room,
        {
          $push: { members: req.headers.user },
        },
        { new: true }
      );
      return { roomData };
    } catch (err) {
      res
        .status(400)
        .send({ message: "There was an error while assigning room" });
    }
  }
}
