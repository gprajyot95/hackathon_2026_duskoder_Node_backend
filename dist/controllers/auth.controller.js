"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async authenticateGoogleUser(req, res, next) {
        try {
            const response = await auth_service_1.authService.authenticateGoogleUser(req.body);
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await auth_service_1.authService.getAllUsers();
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
            const result = await auth_service_1.authService.updateUserRole(userId, role);
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
            const result = await auth_service_1.authService.updateUserStatus(userId, status);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
