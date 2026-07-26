import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { updateRoleSchema, updateStatusSchema } from '../validators/auth.validator';

const router = Router();

router.post('/auth/google', (req, res, next) => authController.authenticateGoogleUser(req, res, next));
router.get('/admin/users', (req, res, next) => authController.getAllUsers(req, res, next));
router.put('/admin/users/:userId/role', validate(updateRoleSchema), (req, res, next) => authController.updateUserRole(req, res, next));
router.put('/admin/users/:userId/status', validate(updateStatusSchema), (req, res, next) => authController.updateUserStatus(req, res, next));

export default router;
