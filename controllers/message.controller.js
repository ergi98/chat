import UserSchema from "../schemas/user.schema.js";
import MessageSchema from "../schemas/message.schema.js";

export default class MessageController {
  static async sendMessage(req, res) {
    try {
      const result = await MessageSchema.create({
        text: req.body.text,
        sentBy: req.headers.user,
        roomId: req.headers.room,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem sending this message" });
    }
  }

  static async getMessages(req, res) {
    try {
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem getting your messages" });
    }
  }
}
