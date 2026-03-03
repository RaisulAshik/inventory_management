import { CreditNoteReason } from '@entities/tenant';
import { PaginationDto } from '@common/dto/pagination.dto';
export declare class CreditNoteItemDto {
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
export declare class CreateCreditNoteDto {
    customerId: string;
    salesOrderId?: string;
    salesReturnId?: string;
    reason: CreditNoteReason;
    reasonDetails?: string;
    creditNoteDate: string;
    validUntil?: string;
    currency?: string;
    subtotal: number;
    taxAmount?: number;
    totalAmount: number;
    notes?: string;
    items?: CreditNoteItemDto[];
}
export declare class ApplyToDueDto {
    customerDueId: string;
    amount: number;
}
export declare class CreditNoteFilterDto extends PaginationDto {
    status?: string;
    customerId?: string;
    reason?: string;
    fromDate?: string;
    toDate?: string;
}
