"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const database_config_1 = require("../config/database.config");
class UserRepository {
    async upsertGoogleUser(data) {
        return database_config_1.prisma.appUser.upsert({
            where: { googleId: data.googleId },
            update: {
                email: data.email,
                firstName: data.firstName || '',
                profilePictureUrl: data.profilePictureUrl || '',
                lastLoginAt: new Date(),
                updatedAt: new Date(),
            },
            create: {
                googleId: data.googleId,
                email: data.email,
                firstName: data.firstName || '',
                lastName: '',
                profilePictureUrl: data.profilePictureUrl || '',
                role: data.role || 'USER',
                accountStatus: 'ACTIVE',
                lastLoginAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
    async findAllUsers() {
        return database_config_1.prisma.appUser.findMany({
            orderBy: { id: 'asc' },
        });
    }
    async updateRole(userId, role) {
        return database_config_1.prisma.appUser.update({
            where: { id: userId },
            data: { role, updatedAt: new Date() },
        });
    }
    async updateStatus(userId, status) {
        return database_config_1.prisma.appUser.update({
            where: { id: userId },
            data: { accountStatus: status, updatedAt: new Date() },
        });
    }
    async ensureAdminUserExists() {
        const adminCount = await database_config_1.prisma.appUser.count({ where: { role: 'ADMIN' } });
        if (adminCount === 0) {
            await database_config_1.prisma.appUser.upsert({
                where: { googleId: 'google-admin-001' },
                update: {},
                create: {
                    googleId: 'google-admin-001',
                    email: 'admin@example.com',
                    firstName: 'System',
                    lastName: 'Administrator',
                    profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
                    role: 'ADMIN',
                    accountStatus: 'ACTIVE',
                },
            });
        }
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
