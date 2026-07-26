import { Request, Response, NextFunction } from 'express';
import { chatHistoryService } from '../services/chat-history.service';

export class ChatHistoryController {
  public async getChatSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.query.userId as string) || 'user-1';
      const sessions = await chatHistoryService.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  public async getChatSessionDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      const session = await chatHistoryService.getChatSessionDetails(sessionId);
      if (!session) {
        res.status(404).end();
        return;
      }
      res.json(session);
    } catch (error) {
      res.status(400).end();
    }
  }

  public async createChatSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await chatHistoryService.createChatSession(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteChatSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      const result = await chatHistoryService.deleteChatSession(sessionId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const history = await chatHistoryService.getChatHistory(userId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  public async saveChatMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await chatHistoryService.saveChatMessage(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const chatHistoryController = new ChatHistoryController();
