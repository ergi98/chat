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
  refreshToken: {
    type: String,
    required: false,
    default: "",
  },
});

export default mongoose.model("users", userSchema);
