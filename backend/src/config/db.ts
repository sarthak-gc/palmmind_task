import mongoose from "mongoose";
import { MONGO_URI } from "../utils/constants";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("db connected");
  } catch (error) {
    console.error("connection failed", error);
    process.exit(1);
  }
};

connectDB();
