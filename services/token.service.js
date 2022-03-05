import jwt from "jsonwebtoken";

export function createToken(userData) {
  return jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: "15s" });
}

export function createRefreshToken(userData) {
  return jwt.sign(userData, process.env.REFRESH_SECRET_KEY);
}

export async function validateToken(bearer) {
  if (bearer !== undefined) {
    const jwt = bearer.split(" ")[1];
    return await verify(jwt);
  } else {
    return { isValid: false };
  }
}

export function decodeToken(bearer) {
  return jwt.decode(bearer.split(" ")[1]);
}

const verify = async (userJwt) => {
  return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
    if (error) {
      return {
        isValid: false,
        error,
      };
    }
    return { isValid: true };
  });
};
