import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  public async authenticateGoogleUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await authService.authenticateGoogleUser(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await authService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  public async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const role = req.body.role;
      const result = await authService.updateUserRole(userId, role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const status = req.body.status;
      const result = await authService.updateUserStatus(userId, status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
