import express from "express";
import {
  deleteUser,
  updateName,
  updatePassword,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.put("/name", updateName);
router.put("/password", updatePassword);
router.delete("/me", deleteUser);

export default router;
