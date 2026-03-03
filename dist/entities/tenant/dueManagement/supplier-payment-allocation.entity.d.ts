import { SupplierPayment } from './supplier-payment.entity';
import { SupplierDue } from './supplier-due.entity';
export declare class SupplierPaymentAllocation {
    id: string;
    paymentId: string;
    supplierDueId: string;
    allocatedAmount: number;
    allocationDate: Date;
    notes: string;
    createdBy: string;
    createdAt: Date;
    payment: SupplierPayment;
    supplierDue: SupplierDue;
}
