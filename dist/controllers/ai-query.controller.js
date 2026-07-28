import { aiQueryService } from '../services/ai-query.service';
import { logger } from '../config/logger.config';
export class AiQueryController {
    async processQuery(req, res, next) {
        try {
            logger.info('Received POST /api/ai/query request');
            const response = await aiQueryService.processUserQuestion(req.body);
            if (response.error) {
                res.status(400).json(response);
                return;
            }
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
export const aiQueryController = new AiQueryController();
