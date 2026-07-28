import { prisma } from '../config/database.config';
export class UserRepository {
    async upsertGoogleUser(data) {
        return prisma.appUser.upsert({
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
        return prisma.appUser.findMany({
            orderBy: { id: 'asc' },
        });
    }
    async updateRole(userId, role) {
        return prisma.appUser.update({
            where: { id: userId },
            data: { role, updatedAt: new Date() },
        });
    }
    async updateStatus(userId, status) {
        return prisma.appUser.update({
            where: { id: userId },
            data: { accountStatus: status, updatedAt: new Date() },
        });
    }
    async ensureAdminUserExists() {
        const adminCount = await prisma.appUser.count({ where: { role: 'ADMIN' } });
        if (adminCount === 0) {
            await prisma.appUser.upsert({
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
export const userRepository = new UserRepository();
