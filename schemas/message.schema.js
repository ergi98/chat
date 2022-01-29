import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sentAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sentBy: {
    type: "ObjectId",
    ref: "users",
    required: true,
  },
  roomId: {
    type: "ObjectId",
    ref: "rooms",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  resentAt: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["sending", "sent", "error"],
    default: "sent",
    required: true,
  },
});

export default mongoose.model("messages", messageSchema);
