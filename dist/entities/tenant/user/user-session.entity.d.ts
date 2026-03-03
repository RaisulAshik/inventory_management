import { User } from './user.entity';
export declare class UserSession {
    id: string;
    userId: string;
    tokenHash: string;
    refreshTokenHash: string;
    deviceType: string;
    deviceName: string;
    browser: string;
    os: string;
    ipAddress: string;
    location: string;
    expiresAt: Date;
    refreshExpiresAt: Date;
    lastActivityAt: Date;
    createdAt: Date;
    user: User;
    get isExpired(): boolean;
}
