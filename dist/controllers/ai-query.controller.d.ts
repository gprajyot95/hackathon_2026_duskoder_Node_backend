import { Request, Response, NextFunction } from 'express';
export declare class AiQueryController {
    processQuery(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const aiQueryController: AiQueryController;
