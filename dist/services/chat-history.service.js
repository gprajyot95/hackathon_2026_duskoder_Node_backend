"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHistoryService = exports.ChatHistoryService = void 0;
const crypto_1 = require("crypto");
const chat_repository_1 = require("../repositories/chat.repository");
const gemini_service_1 = require("./gemini.service");
const logger_config_1 = require("../config/logger.config");
class ChatHistoryService {
    async getChatSessions(userId = 'user-1') {
        try {
            return await chat_repository_1.chatRepository.findSessionsByUserId(userId);
        }
        catch (e) {
            logger_config_1.logger.warn(`Error querying chat_session table: ${e.message}`);
            return [];
        }
    }
    async getChatSessionDetails(sessionId) {
        try {
            const session = await chat_repository_1.chatRepository.findSessionById(sessionId);
            if (!session)
                return null;
            const formattedMessages = session.messages.map(m => ({
                id: m.id,
                sessionId: m.sessionId,
                userId: m.userId,
                sender: m.sender,
                type: m.messageType,
                messageText: m.messageText,
                title: m.title,
                summary: m.summary,
                sql: m.sqlQuery,
                createdAt: m.createdAt,
            }));
            return {
                sessionId: session.sessionId,
                userId: session.userId,
                title: session.title,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                messages: formattedMessages,
            };
        }
        catch (e) {
            logger_config_1.logger.error(`Error retrieving session details for ${sessionId}: ${e.message}`);
            throw e;
        }
    }
    async createChatSession(body) {
        const userId = body && body.userId ? body.userId : 'user-1';
        const sessionId = `session-${Date.now()}-${(0, crypto_1.randomUUID)().substring(0, 5)}`;
        const title = body && body.title ? body.title : 'New Chat';
        logger_config_1.logger.info(`Creating new ChatSession ${sessionId} for user ${userId}`);
        try {
            await chat_repository_1.chatRepository.createSession(sessionId, userId, title);
        }
        catch (e) {
            logger_config_1.logger.error(`Failed to insert new chat_session: ${e.message}`);
        }
        const now = new Date();
        return {
            sessionId,
            userId,
            title,
            createdAt: now,
            updatedAt: now,
        };
    }
    async deleteChatSession(sessionId) {
        logger_config_1.logger.info(`Deleting ChatSession ${sessionId}`);
        try {
            await chat_repository_1.chatRepository.deleteSession(sessionId);
        }
        catch (e) {
            logger_config_1.logger.warn(`Error deleting session ${sessionId}: ${e.message}`);
        }
        return {
            status: 'DELETED',
            sessionId,
        };
    }
    async getChatHistory(userId) {
        logger_config_1.logger.info(`Fetching chat history for user: ${userId}`);
        try {
            const messages = await chat_repository_1.chatRepository.findMessagesByUserId(userId);
            return messages.map(m => ({
                id: m.id,
                sessionId: m.sessionId,
                userId: m.userId,
                sender: m.sender,
                type: m.messageType,
                messageText: m.messageText,
                title: m.title,
                summary: m.summary,
                sql: m.sqlQuery,
                createdAt: m.createdAt,
            }));
        }
        catch (e) {
            logger_config_1.logger.warn(`Error querying chat_message table: ${e.message}`);
            return [];
        }
    }
    async saveChatMessage(body) {
        const id = body.id || `msg-${Date.now()}`;
        let sessionId = body.sessionId;
        const userId = body.userId || 'user-1';
        const sender = body.sender || 'user';
        const type = body.type || 'text';
        const messageText = body.messageText || body.answer;
        const title = body.title;
        const summary = body.summary;
        const sql = body.sql;
        if (!sessionId || sessionId.trim().length === 0) {
            sessionId = `session-${Date.now()}`;
        }
        // Ensure session exists
        let existingSessionTitle = 'New Chat';
        try {
            const session = await chat_repository_1.chatRepository.upsertSession(sessionId, userId);
            existingSessionTitle = session.title;
        }
        catch (e) {
            logger_config_1.logger.warn(`Could not auto-create session ${sessionId}: ${e.message}`);
        }
        // Save message
        try {
            await chat_repository_1.chatRepository.saveMessage({
                id,
                sessionId,
                userId,
                sender,
                messageType: type,
                messageText,
                title,
                summary,
                sqlQuery: sql,
            });
        }
        catch (e) {
            logger_config_1.logger.warn(`Could not save chat message to DB: ${e.message}`);
        }
        const isUserSender = 'user'.toLowerCase() === sender.toLowerCase();
        // Async AI Title Generation on first user message
        if (isUserSender && (!existingSessionTitle || existingSessionTitle === 'New Chat')) {
            const finalSessionId = sessionId;
            const finalQuestion = messageText;
            setImmediate(async () => {
                try {
                    logger_config_1.logger.info(`Generating async AI title for session ${finalSessionId}...`);
                    const aiTitle = await gemini_service_1.geminiService.generateChatTitle(finalQuestion);
                    if (aiTitle && aiTitle.trim().length > 0) {
                        await chat_repository_1.chatRepository.updateSessionTitle(finalSessionId, aiTitle);
                        logger_config_1.logger.info(`Async updated ChatSession ${finalSessionId} title to '${aiTitle}'`);
                    }
                }
                catch (e) {
                    logger_config_1.logger.warn(`Async AI title generation error for session ${finalSessionId}: ${e.message}`);
                }
            });
        }
        return {
            status: 'SAVED',
            sessionId,
            title: existingSessionTitle,
        };
    }
}
exports.ChatHistoryService = ChatHistoryService;
exports.chatHistoryService = new ChatHistoryService();
