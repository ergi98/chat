export default class UploadController {
  static async uploadImage(req, res) {
    try {
      res
        .status(200)
        .send({ message: "File successfully uploaded!", file: req.file });
    } catch (err) {
      res
        .status(404)
        .send({ message: "An error occured while trying to store the image!" });
    }
  }

  static async uploadAudio(req, res) {
    try {
      res
        .status(200)
        .send({ message: "File successfully uploaded!", file: req.file });
    } catch (err) {
      res
        .status(404)
        .send({ message: "An error occured while trying to store the image!" });
    }
  }
}
