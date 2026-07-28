import { chatHistoryService } from '../services/chat-history.service';
export class ChatHistoryController {
    async getChatSessions(req, res, next) {
        try {
            const userId = req.query.userId || 'user-1';
            const sessions = await chatHistoryService.getChatSessions(userId);
            res.json(sessions);
        }
        catch (error) {
            next(error);
        }
    }
    async getChatSessionDetails(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            const session = await chatHistoryService.getChatSessionDetails(sessionId);
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
            const result = await chatHistoryService.createChatSession(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteChatSession(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            const result = await chatHistoryService.deleteChatSession(sessionId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getChatHistory(req, res, next) {
        try {
            const userId = req.params.userId;
            const history = await chatHistoryService.getChatHistory(userId);
            res.json(history);
        }
        catch (error) {
            next(error);
        }
    }
    async saveChatMessage(req, res, next) {
        try {
            const result = await chatHistoryService.saveChatMessage(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
export const chatHistoryController = new ChatHistoryController();
