import { Router } from 'express';
import { dataController } from '../controllers/data.controller';

const router = Router();

router.get('/cache/data', (req, res, next) => dataController.getCachedData(req, res, next));
router.get('/schema/metadata', (req, res, next) => dataController.getCachedData(req, res, next));
router.post('/cache/refresh', (req, res, next) => dataController.refreshCache(req, res, next));
router.delete('/cache/data', (req, res, next) => dataController.evictCache(req, res, next));
router.get('/health', (req, res, next) => dataController.getHealth(req, res, next));

export default router;
