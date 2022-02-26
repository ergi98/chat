import express from "express";
// import multer from "multer";

import { imageUpload, audioUpload } from "../middleware/multer.js";

const router = express.Router();

// Controllers
import UploadController from "../controllers/upload.controller.js";
import tokenMiddleware from "../middleware/token.js";

router
  .route("/upload-image")
  .post(
    tokenMiddleware,
    imageUpload.single("image"),
    UploadController.uploadImage
  );
router
  .route("/upload-audio")
  .post(
    tokenMiddleware,
    audioUpload.single("audio"),
    UploadController.uploadAudio
  );

// router.route("/get-user").get(UploadController.uploadVoiceRecording)

export default router;
