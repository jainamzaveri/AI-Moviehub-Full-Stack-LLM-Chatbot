import express from "express";
import { movieChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/movie", movieChat);

export default router;