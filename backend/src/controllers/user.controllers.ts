import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/User";

export const updateName = async (req: Request, res: Response) => {
  const { username } = req.body || {};
  if (!username) {
    res
      .status(400)
      .json({ status: "error", message: "nothing to update, name required" });
    return;
  }
  const user = await User.findByIdAndUpdate(
    req.id,
    { username },
    { new: true }
  );

  if (!user) {
    res.status(404).json({ status: "error", message: "user not found" });
    return;
  }

  res.json({
    status: "success",
    message: "username updated",
    data: {
      username: user.username,
    },
  });
};
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.id;
  const deletedUser = await User.deleteOne({ _id: id });
  if (deletedUser.deletedCount === 0) {
    res.status(404).json({
      status: "error",
      message: "user not found",
    });
    return;
  }
  res.json({
    status: "success",
    message: "user deleted",
  });
};
export const updatePassword = async (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (!password) {
    res.status(400).json({
      status: "error",
      message: "nothing to update, password required",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.findByIdAndUpdate(
    req.id,
    { password: hashedPassword },
    { new: true }
  );

  if (!user) {
    res.status(404).json({ status: "error", message: "user not found" });
    return;
  }

  res.json({
    status: "success",
    message: "username updated",
    data: {
      username: user.username,
    },
  });
};
export const me = async (req: Request, res: Response) => {
  res.json({
    id: req.id,
  });
};

export const searchUser = async (req: Request, res: Response) => {
  const { u: username } = req.query;
  if (typeof username !== "string") {
    res.status(400).json({
      status: "error",
      message: "username required",
    });
    return;
  }
  if (!username || !username.trim()) {
    res.status(400).json({
      status: "error",
      message: "username required",
    });
    return;
  }
  const users = await User.find({
    username: { $regex: username, $options: "i" },
  });
  const updatedUsers = users.map((user) => ({
    id: user._id,
    username: user.username,
  }));
  if (users.length === 0) {
    res.status(404).json({ message: "users not found" });
    return;
  }
  res.json({
    status: "success",
    message: "Users retrieved",
    data: {
      users: updatedUsers,
    },
  });
};
