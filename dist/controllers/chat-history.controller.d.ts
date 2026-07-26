import { Request, Response, NextFunction } from 'express';
export declare class ChatHistoryController {
    getChatSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChatSessionDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    createChatSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteChatSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    saveChatMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const chatHistoryController: ChatHistoryController;
