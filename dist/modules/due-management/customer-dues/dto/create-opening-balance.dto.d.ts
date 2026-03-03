export declare class CreateOpeningBalanceDto {
    customerId: string;
    originalAmount: number;
    dueDate: string;
    referenceNumber?: string;
    currency?: string;
    notes?: string;
}
export declare class AdjustDueDto {
    amount: number;
    reason?: string;
}
export declare class WriteOffDueDto {
    amount: number;
    reason: string;
}
