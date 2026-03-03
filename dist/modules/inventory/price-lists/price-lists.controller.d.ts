import { PriceListsService } from './price-lists.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { PriceListType } from '@entities/tenant';
import { CreatePriceListItemDto } from './dto/create-price-list-item.dto';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { PriceListResponseDto } from './dto/price-list-response.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
export declare class PriceListsController {
    private readonly priceListsService;
    constructor(priceListsService: PriceListsService);
    create(createPriceListDto: CreatePriceListDto, currentUser: JwtPayload): Promise<PriceListResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: PriceListResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findAllActive(): Promise<{
        data: PriceListResponseDto[];
    }>;
    findByType(type: PriceListType): Promise<{
        data: PriceListResponseDto[];
    }>;
    getDefault(type: PriceListType): Promise<{
        data: PriceListResponseDto | null;
    }>;
    getProductPrice(priceListId: string, productId: string, quantity?: number, variantId?: string): Promise<{
        price: number | null;
    }>;
    findOne(id: string): Promise<PriceListResponseDto>;
    getItems(id: string): Promise<{
        data: import("@entities/tenant").PriceListItem[];
    }>;
    update(id: string, updatePriceListDto: UpdatePriceListDto): Promise<PriceListResponseDto>;
    remove(id: string): Promise<void>;
    copyPriceList(id: string, body: {
        newCode: string;
        newName: string;
    }, currentUser: JwtPayload): Promise<PriceListResponseDto>;
    addItem(id: string, itemDto: CreatePriceListItemDto): Promise<import("@entities/tenant").PriceListItem>;
    bulkAddItems(id: string, body: {
        items: CreatePriceListItemDto[];
    }): Promise<{
        added: number;
        skipped: number;
    }>;
    updateItem(itemId: string, itemDto: Partial<CreatePriceListItemDto>): Promise<import("@entities/tenant").PriceListItem>;
    removeItem(itemId: string): Promise<void>;
}
