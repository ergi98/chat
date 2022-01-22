import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  members: {
    type: ["ObjectId"],
    default: [],
    ref: "users",
  },
});

export default mongoose.model("rooms", roomSchema);
