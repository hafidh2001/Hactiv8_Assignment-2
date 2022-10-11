import jwt from "jsonwebtoken";
import { jwt_secret } from "../config.js";
import * as fs from "fs";
import { pathJSON } from "../config.js";

export const checkCredential = async (req, res, next) => {
  // get authorization token
  const { authorization } = req.headers;
  try {
    // check if token exists
    if (!authorization) {
      res.json({
        status: "error",
        message: "failed to access, credentials not found",
      });
      return;
    }
    // split token
    const token = authorization.split("Bearer ");
    // verify token using jwt
    const decode = jwt.verify(token[1], jwt_secret);
    delete decode.iat;
    delete decode.exp;
    // check decode token with user data
    const convert_toJSON = JSON.parse(fs.readFileSync(pathJSON, "utf8"));
    const user = convert_toJSON.filter((item) => item.email === decode.email);

    // check if user is exist
    if (user.length === 0) {
      res.json({ status: "error", message: "authorization failed" });
      return;
    }
    req.user = {
      id: user[0].id,
      email: user[0].email,
    };
    next();
  } catch (error) {
    next(error);
  }
};
