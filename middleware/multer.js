import multer from "multer";
import * as fs from "fs";

// IMAGE
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.access("images/", (err) => {
      if (err) {
        fs.mkdirSync("images");
      }
      cb(null, "images/");
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const imageUpload = multer({ storage: imageStorage });

// AUDIO
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.access("audio/", (err) => {
      if (err) {
        fs.mkdirSync("audio");
      }
      cb(null, "audio/");
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const audioUpload = multer({ storage: audioStorage });

export { imageUpload, audioUpload };
