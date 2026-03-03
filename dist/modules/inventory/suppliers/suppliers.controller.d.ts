import { SuppliersService } from './suppliers.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierFilterDto } from './dto/supplier-filter.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateSupplierContactDto } from './dto/create-supplier-contact.dto';
import { CreateSupplierProductDto } from './dto/create-supplier-product.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto, currentUser: JwtPayload): Promise<SupplierResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: SupplierFilterDto): Promise<{
        data: SupplierResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findAllActive(): Promise<{
        data: SupplierResponseDto[];
    }>;
    findOne(id: string): Promise<SupplierResponseDto>;
    getOutstandingBalance(id: string): Promise<{
        balance: number;
    }>;
    getProducts(id: string): Promise<{
        data: import("../../../entities/tenant").SupplierProduct[];
    }>;
    update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<SupplierResponseDto>;
    remove(id: string): Promise<void>;
    addContact(id: string, contactDto: CreateSupplierContactDto): Promise<import("../../../entities/tenant").SupplierContact>;
    updateContact(contactId: string, contactDto: CreateSupplierContactDto): Promise<import("../../../entities/tenant").SupplierContact>;
    removeContact(contactId: string): Promise<void>;
    addProduct(id: string, productDto: CreateSupplierProductDto): Promise<import("../../../entities/tenant").SupplierProduct>;
    updateProduct(productId: string, productDto: CreateSupplierProductDto): Promise<import("../../../entities/tenant").SupplierProduct>;
    removeProduct(productId: string): Promise<void>;
}
