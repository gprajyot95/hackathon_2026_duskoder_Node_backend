import { Router } from 'express';
import dataRoutes from './data.routes';
import aiQueryRoutes from './ai-query.routes';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';

const masterRouter = Router();

masterRouter.use('/api', dataRoutes);
masterRouter.use('/api', authRoutes);
masterRouter.use('/api/ai', aiQueryRoutes);
masterRouter.use('/api/chat', chatRoutes);

export default masterRouter;
