import { GrnService } from './grn.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { CreateGrnDto } from './dto/create-grn.dto';
import { GrnFilterDto } from './dto/grn-filter.dto';
import { GrnResponseDto } from './dto/grn-response.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
export declare class GrnController {
    private readonly grnService;
    constructor(grnService: GrnService);
    create(createDto: CreateGrnDto, currentUser: JwtPayload): Promise<GrnResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: GrnFilterDto): Promise<{
        data: GrnResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    getGrnsForPurchaseOrder(poId: string): Promise<{
        data: GrnResponseDto[];
    }>;
    findOne(id: string): Promise<GrnResponseDto>;
    update(id: string, updateDto: UpdateGrnDto): Promise<GrnResponseDto>;
    submitForApproval(id: string): Promise<GrnResponseDto>;
    completeQc(id: string, currentUser: JwtPayload): Promise<GrnResponseDto>;
    approve(id: string, currentUser: JwtPayload): Promise<GrnResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<GrnResponseDto>;
    remove(id: string): Promise<void>;
}
