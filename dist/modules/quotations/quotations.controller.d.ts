import { QuotationsService } from './quotations.service';
import { JwtPayload } from '@common/interfaces';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QuotationResponseDto, QuotationDetailResponseDto } from './dto/quotation-response.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QuotationFilterDto } from './dto/quotation-filter.dto';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    create(createDto: CreateQuotationDto, currentUser: JwtPayload): Promise<QuotationResponseDto>;
    findAll(filterDto: QuotationFilterDto): Promise<{
        data: QuotationResponseDto[];
        meta: any;
    }>;
    findByNumber(quotationNumber: string): Promise<{
        data: QuotationResponseDto | null;
    }>;
    findOne(id: string): Promise<QuotationDetailResponseDto>;
    update(id: string, updateDto: UpdateQuotationDto): Promise<QuotationResponseDto>;
    remove(id: string): Promise<void>;
    send(id: string, sendId: string, currentUser: JwtPayload): Promise<QuotationResponseDto>;
    accept(id: string, acceptId: string, currentUser: JwtPayload): Promise<QuotationResponseDto>;
    reject(id: string, reason: string, currentUser: JwtPayload): Promise<QuotationResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<QuotationResponseDto>;
    convertToSalesOrder(id: string, orderId: string, currentUser: JwtPayload): Promise<{
        message: string;
        quotation: QuotationResponseDto;
        salesOrder: {
            id: string;
            orderNumber: string;
            status: import("../../common/enums").SalesOrderStatus;
            totalAmount: number;
        };
    }>;
}
