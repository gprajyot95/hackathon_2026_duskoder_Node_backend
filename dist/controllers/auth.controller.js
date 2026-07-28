import { authService } from '../services/auth.service';
export class AuthController {
    async authenticateGoogleUser(req, res, next) {
        try {
            const response = await authService.authenticateGoogleUser(req.body);
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await authService.getAllUsers();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUserRole(req, res, next) {
        try {
            const userId = parseInt(req.params.userId, 10);
            const role = req.body.role;
            const result = await authService.updateUserRole(userId, role);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUserStatus(req, res, next) {
        try {
            const userId = parseInt(req.params.userId, 10);
            const status = req.body.status;
            const result = await authService.updateUserStatus(userId, status);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
