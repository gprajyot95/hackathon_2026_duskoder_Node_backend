import { AppUser } from '@prisma/client';
export declare class UserRepository {
    upsertGoogleUser(data: {
        googleId: string;
        email: string;
        firstName?: string;
        profilePictureUrl?: string;
        role?: string;
    }): Promise<AppUser>;
    findAllUsers(): Promise<AppUser[]>;
    updateRole(userId: number, role: string): Promise<AppUser>;
    updateStatus(userId: number, status: string): Promise<AppUser>;
    ensureAdminUserExists(): Promise<void>;
}
export declare const userRepository: UserRepository;
