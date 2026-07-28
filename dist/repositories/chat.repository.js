"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepository = exports.ChatRepository = void 0;
const database_config_1 = require("../config/database.config");
class ChatRepository {
    async findSessionsByUserId(userId) {
        return database_config_1.prisma.chatSession.findMany({
            where: { userId },
            select: {
                sessionId: true,
                userId: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findSessionById(sessionId) {
        return database_config_1.prisma.chatSession.findUnique({
            where: { sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async createSession(sessionId, userId, title) {
        return database_config_1.prisma.chatSession.create({
            data: {
                sessionId,
                userId,
                title,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastMessageAt: new Date(),
            },
        });
    }
    async deleteSession(sessionId) {
        await database_config_1.prisma.chatMessage.deleteMany({ where: { sessionId } });
        await database_config_1.prisma.chatSession.delete({ where: { sessionId } });
    }
    async findMessagesByUserId(userId) {
        return database_config_1.prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async upsertSession(sessionId, userId, title = 'New Chat') {
        return database_config_1.prisma.chatSession.upsert({
            where: { sessionId },
            update: { updatedAt: new Date(), lastMessageAt: new Date() },
            create: {
                sessionId,
                userId,
                title,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastMessageAt: new Date(),
            },
        });
    }
    async saveMessage(data) {
        return database_config_1.prisma.chatMessage.create({
            data: {
                id: data.id,
                sessionId: data.sessionId,
                userId: data.userId,
                sender: data.sender,
                messageType: data.messageType || 'text',
                messageText: data.messageText,
                title: data.title,
                summary: data.summary,
                sqlQuery: data.sqlQuery,
                createdAt: new Date(),
            },
        });
    }
    async updateSessionTitle(sessionId, title) {
        await database_config_1.prisma.chatSession.update({
            where: { sessionId },
            data: { title, updatedAt: new Date() },
        });
    }
}
exports.ChatRepository = ChatRepository;
exports.chatRepository = new ChatRepository();
