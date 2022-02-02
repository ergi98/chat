import express from "express";
import MessageController from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send-message").post(MessageController.sendMessage);
router.route("/get-messages").get(MessageController.getMessages);

export default router;
