import jwt from "jsonwebtoken";
import config from "config";

export default function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if not token
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  //Verify token
  try {
    req.customer = jwt.verify(token, config.get("jwtSecret"));
    next();
  } catch (e) {
    res.status(401).json(`${e}`);
  }
}
