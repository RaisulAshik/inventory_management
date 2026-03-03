import { JwtPayload } from '@common/interfaces';
import { SupplierPaymentsService } from './supplier-payments.service';
import { CreateSupplierPaymentDto, SupplierPaymentFilterDto, AllocatePaymentDto } from './dto/supplier-payment.dto';
export declare class SupplierPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: SupplierPaymentsService);
    create(dto: CreateSupplierPaymentDto, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
    findAll(filterDto: SupplierPaymentFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").SupplierPayment>>;
    findOne(id: string): Promise<import("../../../entities/tenant").SupplierPayment>;
    submit(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
    approve(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
    process(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
    complete(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
    allocate(id: string, dto: AllocatePaymentDto, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
    cancel(id: string, reason: string, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierPayment>;
}
