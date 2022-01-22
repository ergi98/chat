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
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model("messages", messageSchema);
