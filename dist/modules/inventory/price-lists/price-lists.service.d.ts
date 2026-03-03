import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { PriceList, PriceListItem, PriceListType } from '@entities/tenant';
import { CreatePriceListItemDto } from './dto/create-price-list-item.dto';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
export declare class PriceListsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getPriceListRepository;
    create(createPriceListDto: CreatePriceListDto, createdBy: string): Promise<PriceList>;
    private createItems;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<PriceList>>;
    findAllActive(): Promise<PriceList[]>;
    findByType(type: PriceListType): Promise<PriceList[]>;
    getDefault(type: PriceListType): Promise<PriceList | null>;
    findById(id: string): Promise<PriceList>;
    update(id: string, updatePriceListDto: UpdatePriceListDto): Promise<PriceList>;
    remove(id: string): Promise<void>;
    getProductPrice(priceListId: string, productId: string, quantity?: number, variantId?: string): Promise<number | null>;
    addItem(priceListId: string, itemDto: CreatePriceListItemDto): Promise<PriceListItem>;
    updateItem(itemId: string, itemDto: Partial<CreatePriceListItemDto>): Promise<PriceListItem>;
    removeItem(itemId: string): Promise<void>;
    getItems(priceListId: string): Promise<PriceListItem[]>;
    bulkAddItems(priceListId: string, items: CreatePriceListItemDto[]): Promise<{
        added: number;
        skipped: number;
    }>;
    copyPriceList(sourceId: string, newCode: string, newName: string, createdBy: string): Promise<PriceList>;
}
