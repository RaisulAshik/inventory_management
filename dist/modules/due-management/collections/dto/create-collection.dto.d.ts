export declare class CollectionAllocationDto {
    customerDueId: string;
    amount: number;
    notes?: string;
}
export declare class CreateCollectionDto {
    customerId: string;
    paymentMethodId: string;
    amount: number;
    collectionDate: string;
    currency?: string;
    referenceNumber?: string;
    chequeNumber?: string;
    chequeDate?: string;
    chequeBank?: string;
    notes?: string;
    allocations?: CollectionAllocationDto[];
}
export declare class AllocateCollectionDto {
    allocations: CollectionAllocationDto[];
}
export declare class DepositDto {
    bankAccountId: string;
    depositDate: string;
}
export declare class BounceDto {
    bounceDate: string;
    bounceReason: string;
    bounceCharges?: number;
}
export declare class CollectionFilterDto {
    search?: string;
    status?: string;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
