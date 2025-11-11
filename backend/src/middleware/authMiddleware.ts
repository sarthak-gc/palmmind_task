import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
import { JWT_SECRET } from "../utils/constants";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const id = (decoded as JwtPayload).id;
    req.id = id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ status: "error", message: "user not found" });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "invalid token" });
  }
};
