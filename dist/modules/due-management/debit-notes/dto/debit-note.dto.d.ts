import { DebitNoteReason } from '@entities/tenant';
import { PaginationDto } from '@common/dto/pagination.dto';
export declare class DebitNoteItemDto {
    productId: string;
    variantId?: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    taxAmount?: number;
    lineTotal: number;
    notes?: string;
}
export declare class CreateDebitNoteDto {
    supplierId: string;
    purchaseOrderId?: string;
    grnId?: string;
    purchaseReturnId?: string;
    reason: DebitNoteReason;
    reasonDetails?: string;
    debitNoteDate: string;
    currency?: string;
    subtotal: number;
    taxAmount?: number;
    totalAmount: number;
    notes?: string;
    items?: DebitNoteItemDto[];
}
export declare class AcknowledgeDebitNoteDto {
    acknowledgementNumber?: string;
    acknowledgementDate?: string;
}
export declare class ApplyToSupplierDueDto {
    supplierDueId: string;
    amount: number;
}
export declare class DebitNoteFilterDto extends PaginationDto {
    status?: string;
    supplierId?: string;
    reason?: string;
    fromDate?: string;
    toDate?: string;
}
