import mongoose from "mongoose";
import "../config/db";
import { User } from "../models/User";

import bcrypt from "bcrypt";
const usernames = [
  "sarthak",
  "hari",
  "ramesh",
  "someone",
  "thatperson",
  "thisperson",
  "whoami",
  "random",
];

const pass = "password";

async function seedDB() {
  const users = [];
  await User.deleteMany({});
  for (const username of usernames) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    users.push({ username, password: hashedPassword });
  }

  const createdUsers = await User.insertMany(users);
  if (createdUsers.length == usernames.length) {
    console.log("successful");
  }
  mongoose.connection.close();
}

seedDB();
