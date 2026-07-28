import { prisma } from '../config/database.config';
export class ChatRepository {
    async findSessionsByUserId(userId) {
        return prisma.chatSession.findMany({
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
        return prisma.chatSession.findUnique({
            where: { sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async createSession(sessionId, userId, title) {
        return prisma.chatSession.create({
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
        await prisma.chatMessage.deleteMany({ where: { sessionId } });
        await prisma.chatSession.delete({ where: { sessionId } });
    }
    async findMessagesByUserId(userId) {
        return prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async upsertSession(sessionId, userId, title = 'New Chat') {
        return prisma.chatSession.upsert({
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
        return prisma.chatMessage.create({
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
        await prisma.chatSession.update({
            where: { sessionId },
            data: { title, updatedAt: new Date() },
        });
    }
}
export const chatRepository = new ChatRepository();
