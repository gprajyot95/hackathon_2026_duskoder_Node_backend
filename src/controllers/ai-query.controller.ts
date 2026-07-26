import { Request, Response, NextFunction } from 'express';
import { aiQueryService } from '../services/ai-query.service';
import { logger } from '../config/logger.config';

export class AiQueryController {
  public async processQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Received POST /api/ai/query request');
      const response = await aiQueryService.processUserQuestion(req.body);

      if (response.error) {
        res.status(400).json(response);
        return;
      }
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const aiQueryController = new AiQueryController();
