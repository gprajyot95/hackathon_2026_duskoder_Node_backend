import { ChatSession, ChatMessage } from '@prisma/client';
export declare class ChatRepository {
    findSessionsByUserId(userId: string): Promise<any[]>;
    findSessionById(sessionId: string): Promise<(ChatSession & {
        messages: ChatMessage[];
    }) | null>;
    createSession(sessionId: string, userId: string, title: string): Promise<ChatSession>;
    deleteSession(sessionId: string): Promise<void>;
    findMessagesByUserId(userId: string): Promise<ChatMessage[]>;
    upsertSession(sessionId: string, userId: string, title?: string): Promise<ChatSession>;
    saveMessage(data: {
        id: string;
        sessionId: string;
        userId: string;
        sender: string;
        messageType?: string;
        messageText?: string;
        title?: string;
        summary?: string;
        sqlQuery?: string;
    }): Promise<ChatMessage>;
    updateSessionTitle(sessionId: string, title: string): Promise<void>;
}
export declare const chatRepository: ChatRepository;
