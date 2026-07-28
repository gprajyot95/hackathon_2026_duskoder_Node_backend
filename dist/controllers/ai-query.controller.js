"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiQueryController = exports.AiQueryController = void 0;
const ai_query_service_1 = require("../services/ai-query.service");
const logger_config_1 = require("../config/logger.config");
class AiQueryController {
    async processQuery(req, res, next) {
        try {
            logger_config_1.logger.info('Received POST /api/ai/query request');
            const response = await ai_query_service_1.aiQueryService.processUserQuestion(req.body);
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
exports.AiQueryController = AiQueryController;
exports.aiQueryController = new AiQueryController();
