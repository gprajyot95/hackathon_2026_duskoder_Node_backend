import { ChatSession, ChatMessage } from '@prisma/client';
import { prisma } from '../config/database.config';

export class ChatRepository {
  public async findSessionsByUserId(userId: string): Promise<any[]> {
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

  public async findSessionById(sessionId: string): Promise<(ChatSession & { messages: ChatMessage[] }) | null> {
    return prisma.chatSession.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  public async createSession(sessionId: string, userId: string, title: string): Promise<ChatSession> {
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

  public async deleteSession(sessionId: string): Promise<void> {
    await prisma.chatMessage.deleteMany({ where: { sessionId } });
    await prisma.chatSession.delete({ where: { sessionId } });
  }

  public async findMessagesByUserId(userId: string): Promise<ChatMessage[]> {
    return prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  public async upsertSession(sessionId: string, userId: string, title: string = 'New Chat'): Promise<ChatSession> {
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

  public async saveMessage(data: {
    id: string;
    sessionId: string;
    userId: string;
    sender: string;
    messageType?: string;
    messageText?: string;
    title?: string;
    summary?: string;
    sqlQuery?: string;
  }): Promise<ChatMessage> {
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

  public async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    await prisma.chatSession.update({
      where: { sessionId },
      data: { title, updatedAt: new Date() },
    });
  }
}

export const chatRepository = new ChatRepository();
