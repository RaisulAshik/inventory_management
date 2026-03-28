import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { Supplier, SupplierContact, SupplierProduct } from '@entities/tenant';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierFilterDto } from './dto/supplier-filter.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getSupplierRepository(): Promise<Repository<Supplier>> {
    return this.tenantConnectionManager.getRepository(Supplier);
  }

  /**
   * Create a new supplier
   */
  async create(
    createSupplierDto: CreateSupplierDto,
    createdBy: string,
  ): Promise<Supplier> {
    const supplierRepo = await this.getSupplierRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Generate supplier code if not provided
    const supplierCode =
      createSupplierDto.supplierCode ||
      (await getNextSequence(dataSource, 'SUPPLIER'));

    // Check if code already exists
    const existingSupplier = await supplierRepo.findOne({
      where: { supplierCode },
    });

    if (existingSupplier) {
      throw new BadRequestException(
        `Supplier with code ${supplierCode} already exists`,
      );
    }

    const supplier = supplierRepo.create({
      id: uuidv4(),
      ...createSupplierDto,
      supplierCode,
      createdBy,
    });

    const savedSupplier = await supplierRepo.save(supplier);

    // Create contacts if provided
    if (createSupplierDto.contacts && createSupplierDto.contacts.length > 0) {
      await this.createContacts(
        savedSupplier.id,
        createSupplierDto.contacts,
        dataSource,
      );
    }

    return this.findById(savedSupplier.id);
  }

  /**
   * Create supplier contacts
   */
  private async createContacts(
    supplierId: string,
    contacts: any[],
    dataSource: any,
  ): Promise<void> {
    const contactRepo = dataSource.getRepository(SupplierContact);

    for (let i = 0; i < contacts.length; i++) {
      const contactDto = contacts[i];

      const contact = contactRepo.create({
        id: uuidv4(),
        supplierId,
        ...contactDto,
        isPrimary: contactDto.isPrimary ?? i === 0,
      });

      await contactRepo.save(contact);
    }
  }

  /**
   * Find all suppliers with pagination and filters
   */
  async findAll(
    filterDto: SupplierFilterDto,
  ): Promise<PaginatedResult<Supplier>> {
    const supplierRepo = await this.getSupplierRepository();

    const queryBuilder = supplierRepo
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.contacts', 'contacts')
      .where('supplier.deletedAt IS NULL');

    // Apply filters
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('supplier.isActive = :isActive', {
        isActive: filterDto.isActive,
      });
    }

    if (filterDto.supplierCode) {
      queryBuilder.andWhere('supplier.supplierCode LIKE :supplierCode', {
        supplierCode: `%${filterDto.supplierCode}%`,
      });
    }

    if (filterDto.companyName) {
      queryBuilder.andWhere('supplier.companyName LIKE :companyName', {
        companyName: `%${filterDto.companyName}%`,
      });
    }

    if (filterDto.country) {
      queryBuilder.andWhere('supplier.country = :country', {
        country: filterDto.country,
      });
    }

    if (filterDto.state) {
      queryBuilder.andWhere('supplier.state = :state', {
        state: filterDto.state,
      });
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(supplier.supplierCode LIKE :search OR supplier.companyName LIKE :search OR supplier.email LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'companyName';
      filterDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Get all active suppliers (for dropdowns)
   */
  async findAllActive(): Promise<Supplier[]> {
    const supplierRepo = await this.getSupplierRepository();

    return supplierRepo.find({
      where: { isActive: true, deletedAt: IsNull() },
      order: { companyName: 'ASC' },
    });
  }

  /**
   * Find supplier by ID
   */
  async findById(id: string): Promise<Supplier> {
    const supplierRepo = await this.getSupplierRepository();

    const supplier = await supplierRepo.findOne({
      where: { id },
      relations: ['contacts', 'supplierProducts', 'supplierProducts.product'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  /**
   * Find supplier by code
   */
  async findByCode(code: string): Promise<Supplier | null> {
    const supplierRepo = await this.getSupplierRepository();
    return supplierRepo.findOne({ where: { supplierCode: code } });
  }

  /**
   * Update supplier
   */
  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplierRepo = await this.getSupplierRepository();
    const supplier = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateSupplierDto.supplierCode &&
      updateSupplierDto.supplierCode !== supplier.supplierCode
    ) {
      const existingCode = await supplierRepo.findOne({
        where: { supplierCode: updateSupplierDto.supplierCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Supplier with code ${updateSupplierDto.supplierCode} already exists`,
        );
      }
    }

    Object.assign(supplier, updateSupplierDto);
    await supplierRepo.save(supplier);

    return this.findById(id);
  }

  /**
   * Soft delete supplier
   */
  async remove(id: string): Promise<void> {
    const supplierRepo = await this.getSupplierRepository();
    const supplier = await this.findById(id);

    // Check if has pending purchase orders
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const poCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('purchase_orders', 'po')
      .where('po.supplier_id = :id', { id })
      .andWhere('po.status IN (:...statuses)', {
        statuses: [
          'DRAFT',
          'PENDING_APPROVAL',
          'APPROVED',
          'SENT',
          'PARTIALLY_RECEIVED',
        ],
      })
      .getRawOne();

    if (Number(poCount.count) > 0) {
      throw new BadRequestException(
        'Cannot delete supplier with pending purchase orders',
      );
    }

    supplier.deletedAt = new Date();
    await supplierRepo.save(supplier);
  }

  /**
   * Add contact to supplier
   */
  async addContact(
    supplierId: string,
    contactDto: any,
  ): Promise<SupplierContact> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const contactRepo = dataSource.getRepository(SupplierContact);

    // Verify supplier exists
    await this.findById(supplierId);

    const contact = contactRepo.create({
      id: uuidv4(),
      supplierId,
      ...contactDto,
    } as SupplierContact);

    const saved = await contactRepo.save(contact);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  /**
   * Update contact
   */
  async updateContact(
    contactId: string,
    contactDto: any,
  ): Promise<SupplierContact> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const contactRepo = dataSource.getRepository(SupplierContact);

    const contact = await contactRepo.findOne({ where: { id: contactId } });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    Object.assign(contact, contactDto);
    return contactRepo.save(contact);
  }

  /**
   * Remove contact
   */
  async removeContact(contactId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const contactRepo = dataSource.getRepository(SupplierContact);

    await contactRepo.delete(contactId);
  }

  /**
   * Get supplier products
   */
  async getSupplierProducts(supplierId: string): Promise<SupplierProduct[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const supplierProductRepo = dataSource.getRepository(SupplierProduct);

    return supplierProductRepo.find({
      where: { supplierId, isActive: true },
      relations: ['product', 'variant', 'purchaseUom'],
    });
  }

  /**
   * Add product to supplier catalog
   */
  async addProduct(
    supplierId: string,
    productDto: any,
  ): Promise<SupplierProduct> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const supplierProductRepo = dataSource.getRepository(SupplierProduct);

    // Verify supplier exists
    await this.findById(supplierId);

    // Build where clause
    const whereClause: FindOptionsWhere<SupplierProduct> = {
      supplierId,
      productId: productDto.productId,
    };

    // Handle optional variantId
    if (productDto.variantId) {
      whereClause.variantId = productDto.variantId;
    } else {
      whereClause.variantId = IsNull();
    }

    // Check if product already exists for this supplier
    const existing = await supplierProductRepo.findOne({
      where: whereClause,
    });

    if (existing) {
      throw new BadRequestException(
        'Product already exists in supplier catalog',
      );
    }

    const supplierProduct = supplierProductRepo.create({
      id: uuidv4(),
      supplierId,
      ...productDto,
    } as SupplierProduct);

    const saved = await supplierProductRepo.save(supplierProduct);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  /**
   * Update supplier product
   */
  async updateProduct(
    supplierProductId: string,
    productDto: any,
  ): Promise<SupplierProduct> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const supplierProductRepo = dataSource.getRepository(SupplierProduct);

    const supplierProduct = await supplierProductRepo.findOne({
      where: { id: supplierProductId },
    });

    if (!supplierProduct) {
      throw new NotFoundException(
        `Supplier product with ID ${supplierProductId} not found`,
      );
    }

    Object.assign(supplierProduct, productDto);
    return supplierProductRepo.save(supplierProduct);
  }

  /**
   * Remove product from supplier catalog
   */
  async removeProduct(supplierProductId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const supplierProductRepo = dataSource.getRepository(SupplierProduct);

    await supplierProductRepo.delete(supplierProductId);
  }

  /**
   * Get supplier outstanding balance
   */
  async getOutstandingBalance(supplierId: string): Promise<number> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource
      .createQueryBuilder()
      .select(
        'SUM(sd.original_amount - sd.paid_amount - sd.adjusted_amount)',
        'balance',
      )
      .from('supplier_dues', 'sd')
      .where('sd.supplier_id = :supplierId', { supplierId })
      .andWhere('sd.status IN (:...statuses)', {
        statuses: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'],
      })
      .getRawOne();

    return Number(result.balance) || 0;
  }

  /**
   * Count suppliers
   */
  async count(): Promise<number> {
    const supplierRepo = await this.getSupplierRepository();
    return supplierRepo.count({ where: { deletedAt: IsNull() } });
  }
}
