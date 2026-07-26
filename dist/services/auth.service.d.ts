export declare class AuthService {
    authenticateGoogleUser(payload: Record<string, any>): Promise<any>;
    getAllUsers(): Promise<any[]>;
    updateUserRole(userId: number, role: string): Promise<{
        status: string;
    }>;
    updateUserStatus(userId: number, status: string): Promise<{
        status: string;
    }>;
}
export declare const authService: AuthService;
