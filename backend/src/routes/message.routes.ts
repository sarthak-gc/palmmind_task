import express from "express";
import {
  getConversationHistory,
  getGlobalMessages,
  getMessages,
  markAllAsRead,
  sendGlobalMessage,
  sendMessage,
} from "../controllers/message.controllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/conversations", getConversationHistory);
router.post("/message/:receiverId", sendMessage);
router.get("/message/:otherUserId", getMessages);
router.get("/global", getGlobalMessages);
router.post("/global", sendGlobalMessage);
router.put("/:senderId/read", markAllAsRead);

export default router;
