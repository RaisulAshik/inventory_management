import { Quotation } from './quotation.entity';
import { Product } from './product.entity';
export declare class QuotationItem {
    id: string;
    quotationId: string;
    quotation: Quotation;
    productId: string;
    product: Product;
    variantId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discountType: string;
    discountValue: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
    notes: string;
    createdAt: Date;
    name: string | undefined;
}
