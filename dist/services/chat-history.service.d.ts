export declare class ChatHistoryService {
    getChatSessions(userId?: string): Promise<any[]>;
    getChatSessionDetails(sessionId: string): Promise<any | null>;
    createChatSession(body?: Record<string, any>): Promise<any>;
    deleteChatSession(sessionId: string): Promise<any>;
    getChatHistory(userId: string): Promise<any[]>;
    saveChatMessage(body: Record<string, any>): Promise<any>;
}
export declare const chatHistoryService: ChatHistoryService;
