import { AppUser } from '@prisma/client';
import { prisma } from '../config/database.config';

export class UserRepository {
  public async upsertGoogleUser(data: {
    googleId: string;
    email: string;
    firstName?: string;
    profilePictureUrl?: string;
    role?: string;
  }): Promise<AppUser> {
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

  public async findAllUsers(): Promise<AppUser[]> {
    return prisma.appUser.findMany({
      orderBy: { id: 'asc' },
    });
  }

  public async updateRole(userId: number, role: string): Promise<AppUser> {
    return prisma.appUser.update({
      where: { id: userId },
      data: { role, updatedAt: new Date() },
    });
  }

  public async updateStatus(userId: number, status: string): Promise<AppUser> {
    return prisma.appUser.update({
      where: { id: userId },
      data: { accountStatus: status, updatedAt: new Date() },
    });
  }

  public async ensureAdminUserExists(): Promise<void> {
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
