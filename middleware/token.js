import { decodeToken, validateToken } from "../services/token.service.js";

export default async function tokenMiddleware(req, res, next) {
  try {
    let { isValid, error } = await validateToken(req.headers.authorization);
    if (isValid) {
      let decodedToken = decodeToken(req.headers.authorization);
      req.headers.user = decodedToken._id;
      req.headers.room = decodedToken.roomId;
      next();
    } else {
      if (error && error.name === "TokenExpiredError") {
        res.status(400).send({
          type: "token_refresh",
          message: "Current token has expired",
        });
      } else
        res
          .status(403)
          .send({ message: "You do not have permissions for this action " });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
