import { ReturnsService } from './returns.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnFilterDto } from './dto/return-filter.dto';
import { ReturnResponseDto } from './dto/return-response.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
export declare class ReturnsController {
    private readonly returnsService;
    constructor(returnsService: ReturnsService);
    create(createReturnDto: CreateReturnDto, currentUser: JwtPayload): Promise<ReturnResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: ReturnFilterDto): Promise<{
        data: ReturnResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findOne(id: string): Promise<ReturnResponseDto>;
    update(id: string, updateReturnDto: UpdateReturnDto): Promise<ReturnResponseDto>;
    approve(id: string, currentUser: JwtPayload): Promise<ReturnResponseDto>;
    receive(id: string, currentUser: JwtPayload): Promise<ReturnResponseDto>;
    processRefund(id: string, refundAmount: number, currentUser: JwtPayload): Promise<ReturnResponseDto>;
    complete(id: string): Promise<ReturnResponseDto>;
    reject(id: string, reason: string, currentUser: JwtPayload): Promise<ReturnResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<ReturnResponseDto>;
    remove(id: string): Promise<void>;
}
