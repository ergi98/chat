import MessageSchema from "../schemas/message.schema.js";

import mongoose from "mongoose";
export default class MessageController {
  static async sendMessage(req, res) {
    try {
      let payload = req.body.message;
      let messageData = {
        sentBy: req.headers.user,
        roomId: req.headers.room,
      };

      payload.text && (messageData.text = payload.text);
      payload.image && (messageData.image = payload.image);
      payload.audio && (messageData.audio = payload.audio);

      const message = await MessageSchema.create(messageData);
      res.status(200).send({ message });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem sending this message" });
    }
  }

  static async getMessages(req, res) {
    try {
      let lastFetchDate = req.query.lastFetchDate;
      let date = "";

      lastFetchDate === undefined
        ? (lastFetchDate = new Date())
        : (lastFetchDate = new Date(lastFetchDate));

      let result = await MessageSchema.aggregate([
        {
          $match: {
            roomId: mongoose.Types.ObjectId(req.headers.room),
            sentAt: {
              $lt: lastFetchDate,
            },
          },
        },
        {
          $sort: {
            sentAt: -1,
          },
        },
        {
          $limit: 50,
        },
        {
          $sort: {
            sentAt: 1,
          },
        },
      ]);

      if (result && result.length) {
        date = result[0].sentAt;
      }
      res.status(200).send({
        messages: result,
        date,
      });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "There was a problem getting your messages" });
    }
  }
}
