import { createChat, getChats, deleteChat } from "../controllers/chatController.js";
import express from 'express'
import { protect } from "../middlewares/auth.js";

const chatRouter = express.Router();

chatRouter.get('/create', protect, createChat)
chatRouter.get('/chats', protect, getChats)
chatRouter.post('/delete', protect, deleteChat)



export default chatRouter