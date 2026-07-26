import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    authenticateGoogleUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
