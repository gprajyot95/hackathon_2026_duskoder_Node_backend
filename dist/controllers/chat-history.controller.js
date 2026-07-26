"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHistoryController = exports.ChatHistoryController = void 0;
const chat_history_service_1 = require("../services/chat-history.service");
class ChatHistoryController {
    async getChatSessions(req, res, next) {
        try {
            const userId = req.query.userId || 'user-1';
            const sessions = await chat_history_service_1.chatHistoryService.getChatSessions(userId);
            res.json(sessions);
        }
        catch (error) {
            next(error);
        }
    }
    async getChatSessionDetails(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            const session = await chat_history_service_1.chatHistoryService.getChatSessionDetails(sessionId);
            if (!session) {
                res.status(404).end();
                return;
            }
            res.json(session);
        }
        catch (error) {
            res.status(400).end();
        }
    }
    async createChatSession(req, res, next) {
        try {
            const result = await chat_history_service_1.chatHistoryService.createChatSession(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteChatSession(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            const result = await chat_history_service_1.chatHistoryService.deleteChatSession(sessionId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getChatHistory(req, res, next) {
        try {
            const userId = req.params.userId;
            const history = await chat_history_service_1.chatHistoryService.getChatHistory(userId);
            res.json(history);
        }
        catch (error) {
            next(error);
        }
    }
    async saveChatMessage(req, res, next) {
        try {
            const result = await chat_history_service_1.chatHistoryService.saveChatMessage(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChatHistoryController = ChatHistoryController;
exports.chatHistoryController = new ChatHistoryController();
