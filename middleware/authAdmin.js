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
    req.admin = jwt.verify(token, config.get("jwtSecret"));

    if (!req.admin.role)
      return res
        .status(401)
        .json({ msg: "Invalid token, authorization denied" });

    next();
  } catch (e) {
    res.status(401).json(`${e}`);
  }
}
