import mongoose, { Document, Schema } from "mongoose";
type MessageStatus = "Sent" | "Read";
export interface MessageI extends Document {
  sender: mongoose.Types.ObjectId;
  message: string;
  receiver: mongoose.Types.ObjectId;
  status: MessageStatus;
  readAt: Date;
}

const messageSchema = new Schema<MessageI>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true, // not needed in case of global grp msg
    },
    status: {
      type: String,
      enum: ["Sent", "Read"],
      default: "Sent",
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Message = mongoose.model<MessageI>("Message", messageSchema);
