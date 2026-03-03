export declare class AuditLog {
    id: string;
    userId: string;
    action: string;
    module: string;
    entityType: string;
    entityId: string;
    oldValues: Record<string, unknown>;
    newValues: Record<string, unknown>;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
