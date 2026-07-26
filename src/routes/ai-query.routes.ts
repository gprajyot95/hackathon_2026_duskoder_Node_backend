import { Router } from 'express';
import { aiQueryController } from '../controllers/ai-query.controller';
import { validate } from '../middlewares/validate.middleware';
import { userQuestionSchema } from '../validators/ai-query.validator';

const router = Router();

router.post('/query', validate(userQuestionSchema), (req, res, next) => aiQueryController.processQuery(req, res, next));

export default router;
