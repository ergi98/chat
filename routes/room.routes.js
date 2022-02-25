import express from "express";
import RoomController from "../controllers/room.controller.js";
import tokenMiddleware from "../middleware/token.js";

const router = express.Router();

// router.route("/create-room").post(RoomController.createRoom);
// router.route("/assign-to-room").post(RoomController.assignUserToRoom);

router.route("/get-room").get(tokenMiddleware, RoomController.getRoom);
router
  .route("/remove-from-room")
  .post(tokenMiddleware, RoomController.removeFromRoom);
export default router;
