import express from "express";
import MessageController from "../controllers/message.controller.js";
import tokenMiddleware from "../middleware/token.js";

const router = express.Router();

router
  .route("/send-message")
  .post(tokenMiddleware, MessageController.sendMessage);
router
  .route("/get-messages")
  .get(tokenMiddleware, MessageController.getMessages);

export default router;
