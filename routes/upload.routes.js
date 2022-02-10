import express from "express";
// import multer from "multer";

import Multer from "../middleware/multer.js";

const router = express.Router();

// Controllers
import UploadController from "../controllers/upload.controller.js";

// const upload = multer({ dest: "~/user-uploads/images/" });

router
  .route("/upload-image")
  .post(Multer.single("image"), UploadController.uploadImage);

// router.route("/get-user").get(UploadController.uploadVoiceRecording)

export default router;
