import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { Message } from "../models/Message";
import { User } from "../models/User";

export const getConversationHistory = async (req: Request, res: Response) => {
  const userId = req.id;
  const uniqueUsers = new Set();

  const allMessages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "username _id")
    .populate("receiver", "username _id");

  const unreadCounts: { [userId: string]: number } = {};

  if (allMessages.length == 0) {
    res.json({
      status: "success",
      data: {
        uniqueUsersList: [],
        totalMessageCount: 0,
      },
      message: "converstations retrieved",
    });
    return;
  }
  allMessages.forEach((message) => {
    uniqueUsers.add(message.sender._id.toString());
    if (message.receiver) {
      uniqueUsers.add(message.receiver._id.toString());
    }
    if (
      message.receiver &&
      message.receiver._id.toString() === userId.toString() &&
      message.status !== "Read"
    ) {
      const senderId = message.sender._id.toString();
      if (!unreadCounts[senderId]) {
        unreadCounts[senderId] = 0;
      }
      unreadCounts[senderId]++;
    }
  });

  const uniqueUsersList = await User.find({
    _id: { $in: Array.from(uniqueUsers) },
  });

  const formattedUsers = uniqueUsersList.map((user) => {
    const userId = (user._id as ObjectId).toString();
    return {
      id: userId,
      username: user.username,
      unReadCount: unreadCounts[userId] || 0,
    };
  });

  const pastUsers = formattedUsers.filter(
    (elem) => elem.id !== userId.toString()
  );
  const totalMessageCount = uniqueUsers.size - 1;

  res.json({
    status: "success",
    data: {
      uniqueUsersList: pastUsers,
      totalMessageCount,
    },
    message: "converstations retrieved",
  });
};

export const sendMessage = async (req: Request, res: Response) => {
  const { receiverId } = req.params;
  const { message } = req.body;
  const senderId = req.id;

  if (senderId.toString().trim() == receiverId.trim()) {
    res
      .status(400)
      .json({ status: "error", message: "can't send msg to yourself" });
    return;
  }

  if (!message || message.trim() === "") {
    res
      .status(400)
      .json({ status: "error", message: "message can't be empty " });
    return;
  }

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    res.status(404).json({
      status: "error",
      message: "invalid receiver id",
    });
    return;
  }

  const sentMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message,
  });

  if (!sentMessage) {
    res.status(400).json({
      status: "error",
      message: "something went wrong",
    });
    return;
  }

  res.json({
    status: "success",
    message: "Message sent successfully",
    data: {
      sentMessage,
    },
  });
};

export const getMessages = async (req: Request, res: Response) => {
  const { otherUserId } = req.params;
  const userId = req.id;
  const { page = 1 } = req.query;
  const pageSize = 20;

  const messages = await Message.find({
    $or: [
      { sender: otherUserId, receiver: userId },
      { sender: userId, receiver: otherUserId },
    ],
  })
    .skip((parseInt(page as string) - 1) * pageSize)
    .limit(pageSize)
    .populate("sender", "username _id")
    .populate("receiver", "username _id");

  if (messages.length === 0) {
    res.json({
      status: "success",
      message: "No messages",
      data: {
        messages: [],
        count: 0,
      },
    });
    return;
  }

  res.json({
    status: "success",
    message: "Messages Retrieved Successfully",
    data: {
      messages,
      count: messages.length,
    },
  });
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const senderId = req.params.senderId;
  const userId = req.id;

  await Message.updateMany(
    { sender: senderId, receiver: userId },
    { status: "Read" }
  );

  res.json({
    status: "success",
    message: "marked as read",
  });
};
