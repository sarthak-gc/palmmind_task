import express from "express";
import {
  deleteUser,
  me,
  searchUser,
  updateName,
  updatePassword,
} from "../controllers/user.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.put("/name", updateName);
router.put("/password", updatePassword);
router.delete("/me", deleteUser);
router.get("/me", me);
router.get("/search", searchUser);

export default router;
