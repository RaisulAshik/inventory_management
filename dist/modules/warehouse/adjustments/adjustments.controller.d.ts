import { AdjustmentsService } from './adjustments.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { AdjustmentFilterDto } from './dto/adjustment-filter.dto';
import { AdjustmentResponseDto } from './dto/adjustment-response.dto';
import { CreateAdjustmentItemDto } from './dto/create-adjustment-item.dto';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { UpdateAdjustmentDto } from './dto/update-adjustment.dto';
export declare class AdjustmentsController {
    private readonly adjustmentsService;
    constructor(adjustmentsService: AdjustmentsService);
    create(createAdjustmentDto: CreateAdjustmentDto, currentUser: JwtPayload): Promise<AdjustmentResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: AdjustmentFilterDto): Promise<{
        data: AdjustmentResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findOne(id: string): Promise<AdjustmentResponseDto>;
    update(id: string, updateAdjustmentDto: UpdateAdjustmentDto): Promise<AdjustmentResponseDto>;
    submitForApproval(id: string, currentUser: JwtPayload): Promise<AdjustmentResponseDto>;
    approve(id: string, currentUser: JwtPayload): Promise<AdjustmentResponseDto>;
    reject(id: string, reason: string, currentUser: JwtPayload): Promise<AdjustmentResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<AdjustmentResponseDto>;
    remove(id: string): Promise<void>;
    addItem(id: string, itemDto: CreateAdjustmentItemDto): Promise<import("../../../entities/tenant").StockAdjustmentItem>;
    updateItem(itemId: string, itemDto: Partial<CreateAdjustmentItemDto>): Promise<import("../../../entities/tenant").StockAdjustmentItem>;
    removeItem(itemId: string): Promise<void>;
}
