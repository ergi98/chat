import express from "express";
import RoomController from "../controllers/room.controller.js";

const router = express.Router();

router.route("/create-room").post(RoomController.createRoom);
router.route("/check-if-room-exists").get(RoomController.checkIfRoomExists);
router.route("/assign-to-room").post(RoomController.assignUserToRoom);

export default router;
