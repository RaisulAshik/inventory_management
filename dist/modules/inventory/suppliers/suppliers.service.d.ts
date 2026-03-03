import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { Supplier, SupplierContact, SupplierProduct } from '@entities/tenant';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierFilterDto } from './dto/supplier-filter.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
export declare class SuppliersService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getSupplierRepository;
    create(createSupplierDto: CreateSupplierDto, createdBy: string): Promise<Supplier>;
    private createContacts;
    findAll(paginationDto: PaginationDto, filterDto: SupplierFilterDto): Promise<PaginatedResult<Supplier>>;
    findAllActive(): Promise<Supplier[]>;
    findById(id: string): Promise<Supplier>;
    findByCode(code: string): Promise<Supplier | null>;
    update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: string): Promise<void>;
    addContact(supplierId: string, contactDto: any): Promise<SupplierContact>;
    updateContact(contactId: string, contactDto: any): Promise<SupplierContact>;
    removeContact(contactId: string): Promise<void>;
    getSupplierProducts(supplierId: string): Promise<SupplierProduct[]>;
    addProduct(supplierId: string, productDto: any): Promise<SupplierProduct>;
    updateProduct(supplierProductId: string, productDto: any): Promise<SupplierProduct>;
    removeProduct(supplierProductId: string): Promise<void>;
    getOutstandingBalance(supplierId: string): Promise<number>;
    count(): Promise<number>;
}
