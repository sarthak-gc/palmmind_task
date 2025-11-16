import mongoose from "mongoose";
import "../config/db";
import { User } from "../models/User";

import bcrypt from "bcrypt";
import { Message } from "../models/Message";

async function seedDB() {
  const users = [];
  await User.deleteMany({});
  await Message.deleteMany({});
  for (let i = 0; i < 26; i++) {
    const username = String.fromCharCode(97 + i);
    const hashedPassword = await bcrypt.hash(username, 10);
    users.push({ username, password: hashedPassword });
  }

  const createdUsers = await User.insertMany(users);
  if (createdUsers.length == 26) {
    console.log("successful");
  }
  mongoose.connection.close();
}

seedDB();
