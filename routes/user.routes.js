import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.route("/create-user").post(UserController.createUser);
router.route("/get-user").get(UserController.getUser);
router
  .route("/check-if-belongs-to-room")
  .post(UserController.checkIfUserBelongsToRoom);

export default router;
