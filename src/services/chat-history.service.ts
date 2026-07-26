import { randomUUID } from 'crypto';
import { chatRepository } from '../repositories/chat.repository';
import { geminiService } from './gemini.service';
import { logger } from '../config/logger.config';

export class ChatHistoryService {
  public async getChatSessions(userId: string = 'user-1'): Promise<any[]> {
    try {
      return await chatRepository.findSessionsByUserId(userId);
    } catch (e: any) {
      logger.warn(`Error querying chat_session table: ${e.message}`);
      return [];
    }
  }

  public async getChatSessionDetails(sessionId: string): Promise<any | null> {
    try {
      const session = await chatRepository.findSessionById(sessionId);
      if (!session) return null;

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
    } catch (e: any) {
      logger.error(`Error retrieving session details for ${sessionId}: ${e.message}`);
      throw e;
    }
  }

  public async createChatSession(body?: Record<string, any>): Promise<any> {
    const userId = body && body.userId ? body.userId : 'user-1';
    const sessionId = `session-${Date.now()}-${randomUUID().substring(0, 5)}`;
    const title = body && body.title ? body.title : 'New Chat';

    logger.info(`Creating new ChatSession ${sessionId} for user ${userId}`);
    try {
      await chatRepository.createSession(sessionId, userId, title);
    } catch (e: any) {
      logger.error(`Failed to insert new chat_session: ${e.message}`);
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

  public async deleteChatSession(sessionId: string): Promise<any> {
    logger.info(`Deleting ChatSession ${sessionId}`);
    try {
      await chatRepository.deleteSession(sessionId);
    } catch (e: any) {
      logger.warn(`Error deleting session ${sessionId}: ${e.message}`);
    }

    return {
      status: 'DELETED',
      sessionId,
    };
  }

  public async getChatHistory(userId: string): Promise<any[]> {
    logger.info(`Fetching chat history for user: ${userId}`);
    try {
      const messages = await chatRepository.findMessagesByUserId(userId);
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
    } catch (e: any) {
      logger.warn(`Error querying chat_message table: ${e.message}`);
      return [];
    }
  }

  public async saveChatMessage(body: Record<string, any>): Promise<any> {
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
      const session = await chatRepository.upsertSession(sessionId, userId);
      existingSessionTitle = session.title;
    } catch (e: any) {
      logger.warn(`Could not auto-create session ${sessionId}: ${e.message}`);
    }

    // Save message
    try {
      await chatRepository.saveMessage({
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
    } catch (e: any) {
      logger.warn(`Could not save chat message to DB: ${e.message}`);
    }

    const isUserSender = 'user'.toLowerCase() === sender.toLowerCase();

    // Async AI Title Generation on first user message
    if (isUserSender && (!existingSessionTitle || existingSessionTitle === 'New Chat')) {
      const finalSessionId = sessionId;
      const finalQuestion = messageText;

      setImmediate(async () => {
        try {
          logger.info(`Generating async AI title for session ${finalSessionId}...`);
          const aiTitle = await geminiService.generateChatTitle(finalQuestion);
          if (aiTitle && aiTitle.trim().length > 0) {
            await chatRepository.updateSessionTitle(finalSessionId, aiTitle);
            logger.info(`Async updated ChatSession ${finalSessionId} title to '${aiTitle}'`);
          }
        } catch (e: any) {
          logger.warn(`Async AI title generation error for session ${finalSessionId}: ${e.message}`);
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

export const chatHistoryService = new ChatHistoryService();
