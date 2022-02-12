import multer from "multer";
import * as fs from "fs";
// import * as fs from "fs/promises";

const storage = multer.diskStorage({
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

const upload = multer({ storage: storage });

export default upload;
