import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  roomId: {
    type: "ObjectId",
    ref: "chats",
  },
});

export default mongoose.model("users", userSchema);
