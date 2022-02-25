import express from "express";
import UserController from "../controllers/user.controller.js";
import tokenMiddleware from "../middleware/token.js";

const router = express.Router();

// router.route("/create-user").post(UserController.createUser);
router.route("/get-user").get(tokenMiddleware, UserController.getUser);
router
  .route("/check-if-belongs-to-room")
  .post(tokenMiddleware, UserController.checkIfUserBelongsToRoom);
router
  .route("/create-user-and-assign")
  .post(UserController.createUserAndAssignToRoom);
router.route("/create-user-and-room").post(UserController.createUserAndRoom);

export default router;
