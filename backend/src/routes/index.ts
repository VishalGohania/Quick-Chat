import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import ChatGroupController from "../controllers/ChatGroupController.js";
import GroupChatUserType from "../controllers/ChatGroupUserController.js";
import ChatsController from "../controllers/ChatsController.js";

const router = Router();

// Auth routes
router.post("/auth/login", AuthController.login);

//  Chat Group routes
router.get("/chat-group", authMiddleware, ChatGroupController.index);
router.get("/chat-group/:id", ChatGroupController.show);
router.post('/chat-group', authMiddleware, ChatGroupController.store);           
router.put('/chat-group/:id', authMiddleware, ChatGroupController.update);           
router.delete('/chat-group/:id', authMiddleware, ChatGroupController.destroy);     

// Chat group users
router.get("/chat-group-users", GroupChatUserType.index);
router.post("/chat-group-users", GroupChatUserType.store);

// chats
router.get("/chats/:groupId", ChatsController.index)


export default router;