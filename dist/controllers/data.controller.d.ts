import { Request, Response, NextFunction } from 'express';
export declare class DataController {
    getCachedData(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshCache(req: Request, res: Response, next: NextFunction): Promise<void>;
    evictCache(req: Request, res: Response, next: NextFunction): Promise<void>;
    getHealth(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const dataController: DataController;
