import multer from "multer";
import * as fs from "fs";

// IMAGE
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.access(`images/${req.headers.room}/`, (err) => {
      if (err) {
        fs.mkdirSync(`images/${req.headers.room}`);
      }
      cb(null, `images/${req.headers.room}/`);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// AUDIO
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.access(`audio/${req.headers.room}/`, (err) => {
      if (err) {
        fs.mkdirSync(`audio/${req.headers.room}`);
      }
      cb(null, `audio/${req.headers.room}/`);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const imageUpload = multer({ storage: imageStorage });
export const audioUpload = multer({ storage: audioStorage });
