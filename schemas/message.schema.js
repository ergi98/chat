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
    required: false,
    trim: true,
    default: "",
  },
  resentAt: {
    type: Date,
    required: false,
  },
  // Stores the path to the image (if any)
  image: {
    type: String,
    required: false,
    default: "",
  },
  audio: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: String,
    enum: ["sending", "sent", "error"],
    default: "sent",
    required: true,
  },
});

export default mongoose.model("messages", messageSchema);
