export declare enum ResetPeriod {
    NEVER = "NEVER",
    YEARLY = "YEARLY",
    MONTHLY = "MONTHLY",
    DAILY = "DAILY"
}
export declare class SequenceNumber {
    id: string;
    sequenceType: string;
    prefix: string;
    suffix: string;
    currentNumber: number;
    paddingLength: number;
    resetPeriod: ResetPeriod;
    lastResetAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
