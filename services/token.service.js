import jwt from "jsonwebtoken";

export function createToken(userData) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
      ...userData,
    },
    process.env.SECRET_KEY
  );
}

export async function validateToken(bearer) {
  if (bearer !== undefined) {
    const jwt = bearer.split(" ")[1];
    return await verify(jwt);
  } else {
    return false;
  }
}

export function decodeToken(bearer) {
  return jwt.decode(bearer.split(" ")[1]);
}

const verify = async (userJwt) => {
  return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
    if (error) {
      return false;
    }
    return true;
  });
};
