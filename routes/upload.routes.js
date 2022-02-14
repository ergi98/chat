import express from "express";
// import multer from "multer";

import { imageUpload, audioUpload } from "../middleware/multer.js";

const router = express.Router();

// Controllers
import UploadController from "../controllers/upload.controller.js";

// const upload = multer({ dest: "~/user-uploads/images/" });

router
  .route("/upload-image")
  .post(imageUpload.single("image"), UploadController.uploadImage);
router
  .route("/upload-audio")
  .post(audioUpload.single("audio"), UploadController.uploadAudio);

// router.route("/get-user").get(UploadController.uploadVoiceRecording)

export default router;
