import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { JWT_SECRET } from "../utils/constants";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res
      .status(400)
      .json({ status: "error", message: "username and password required" });
    return;
  }
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(409).json({ status: "error", message: "user already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ username, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({
    status: "success",
    message: "user signup successful",
    data: {
      user: {
        id: user._id,
        username: user.username,
      },
      token,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  const user = await User.findOne({ username }).select("_id username password");
  if (!user) {
    res.status(401).json({ status: "error", message: "invalid creds" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ status: "error", message: "invalid creds" });
    return;
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({
    status: "success",
    message: "user login successful",
    data: {
      user: {
        id: user._id,
        username,
      },
      token,
    },
  });
};
