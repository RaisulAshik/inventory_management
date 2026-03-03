import { TransfersService } from './transfers.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ReceiveTransferDto } from './dto/receive-transfer.dto';
import { TransferFilterDto } from './dto/transfer-filter.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
export declare class TransfersController {
    private readonly transfersService;
    constructor(transfersService: TransfersService);
    create(createTransferDto: CreateTransferDto, currentUser: JwtPayload): Promise<TransferResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: TransferFilterDto): Promise<{
        data: TransferResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findOne(id: string): Promise<TransferResponseDto>;
    update(id: string, updateTransferDto: UpdateTransferDto): Promise<TransferResponseDto>;
    submitForApproval(id: string, currentUser: JwtPayload): Promise<TransferResponseDto>;
    approve(id: string, currentUser: JwtPayload): Promise<TransferResponseDto>;
    reject(id: string, reason: string, currentUser: JwtPayload): Promise<TransferResponseDto>;
    ship(id: string, trackingNumber: string, currentUser: JwtPayload): Promise<TransferResponseDto>;
    receive(id: string, receiveDto: ReceiveTransferDto, currentUser: JwtPayload): Promise<TransferResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<TransferResponseDto>;
    remove(id: string): Promise<void>;
    addItem(id: string, itemDto: CreateTransferItemDto): Promise<import("../../../entities/tenant").WarehouseTransferItem>;
    updateItem(itemId: string, itemDto: Partial<CreateTransferItemDto>): Promise<import("../../../entities/tenant").WarehouseTransferItem>;
    removeItem(itemId: string): Promise<void>;
}
