import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import {
  Customer,
  CustomerAddress,
  CustomerCredentials,
  CustomerDue,
} from '@entities/tenant';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getCustomerRepository(): Promise<Repository<Customer>> {
    return this.tenantConnectionManager.getRepository(Customer);
  }

  /**
   * Create a new customer
   */
  async create(
    createCustomerDto: CreateCustomerDto,
    createdBy: string,
  ): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Generate customer code if not provided
    const customerCode =
      createCustomerDto.customerCode ||
      (await getNextSequence(dataSource, 'CUSTOMER'));

    // Check if code already exists
    const existingCustomer = await customerRepo.findOne({
      where: { customerCode },
    });

    if (existingCustomer) {
      throw new BadRequestException(
        `Customer with code ${customerCode} already exists`,
      );
    }

    // Check email uniqueness if provided
    if (createCustomerDto.email) {
      const existingEmail = await customerRepo.findOne({
        where: { email: createCustomerDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException(
          `Customer with email ${createCustomerDto.email} already exists`,
        );
      }
    }

    const customer = customerRepo.create({
      id: uuidv4(),
      ...createCustomerDto,
      customerCode,
      createdBy,
    } as DeepPartial<Customer>);

    const savedCustomer = await customerRepo.save(customer);

    // Create addresses if provided
    if (createCustomerDto.addresses && createCustomerDto.addresses.length > 0) {
      await this.createAddresses(
        savedCustomer.id,
        createCustomerDto.addresses,
        dataSource,
      );
    }

    // Create credentials if password provided (for e-commerce login)
    if (createCustomerDto.password && createCustomerDto.email) {
      await this.createCredentials(
        savedCustomer.id,
        createCustomerDto.email,
        createCustomerDto.password,
        dataSource,
      );
    }

    return this.findById(savedCustomer.id);
  }

  /**
   * Create customer addresses
   */
  private async createAddresses(
    customerId: string,
    addresses: CreateCustomerAddressDto[],
    dataSource: any,
  ): Promise<void> {
    const addressRepo = dataSource.getRepository(CustomerAddress);

    for (let i = 0; i < addresses.length; i++) {
      const addressDto = addresses[i];

      const address = addressRepo.create({
        id: uuidv4(),
        customerId,
        ...addressDto,
        isDefault: addressDto.isDefault ?? i === 0,
      });

      await addressRepo.save(address);
    }
  }

  /**
   * Create customer credentials
   */
  private async createCredentials(
    customerId: string,
    email: string,
    password: string,
    dataSource: any,
  ): Promise<void> {
    const credentialsRepo = dataSource.getRepository(CustomerCredentials);

    const passwordHash = await bcrypt.hash(password, 10);

    const credentials = credentialsRepo.create({
      id: uuidv4(),
      customerId,
      passwordHash,
      emailVerified: false,
    });

    await credentialsRepo.save(credentials);
  }

  /**
   * Find all customers with filters and pagination
   */
  async findAll(
    //paginationDto: PaginationDto,
    filterDto: CustomerFilterDto,
  ): Promise<PaginatedResult<Customer>> {
    const customerRepo = await this.getCustomerRepository();

    const queryBuilder = customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.customerGroup', 'customerGroup')
      .leftJoinAndSelect('customer.priceList', 'priceList')
      .where('customer.deletedAt IS NULL');

    // Apply filters
    if (filterDto.customerType) {
      queryBuilder.andWhere('customer.customerType = :customerType', {
        customerType: filterDto.customerType,
      });
    }

    if (filterDto.customerGroupId) {
      queryBuilder.andWhere('customer.customerGroupId = :customerGroupId', {
        customerGroupId: filterDto.customerGroupId,
      });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('customer.isActive = :isActive', {
        isActive: filterDto.isActive,
      });
    }

    if (filterDto.city) {
      queryBuilder.andWhere('customer.city = :city', {
        city: filterDto.city,
      });
    }

    if (filterDto.state) {
      queryBuilder.andWhere('customer.state = :state', {
        state: filterDto.state,
      });
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(customer.customerCode LIKE :search OR customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.companyName LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'createdAt';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Find customer by ID
   */
  async findById(id: string): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();

    const customer = await customerRepo.findOne({
      where: { id },
      relations: ['customerGroup', 'priceList', 'addresses'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  /**
   * Find customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    const customerRepo = await this.getCustomerRepository();

    return customerRepo.findOne({
      where: { email },
      relations: ['customerGroup', 'priceList'],
    });
  }

  /**
   * Find customer by code
   */
  async findByCode(code: string): Promise<Customer | null> {
    const customerRepo = await this.getCustomerRepository();

    return customerRepo.findOne({
      where: { customerCode: code },
    });
  }

  /**
   * Update customer
   */
  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();
    const customer = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateCustomerDto.customerCode &&
      updateCustomerDto.customerCode !== customer.customerCode
    ) {
      const existingCode = await customerRepo.findOne({
        where: { customerCode: updateCustomerDto.customerCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Customer with code ${updateCustomerDto.customerCode} already exists`,
        );
      }
    }

    // Check email uniqueness if being changed
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingEmail = await customerRepo.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException(
          `Customer with email ${updateCustomerDto.email} already exists`,
        );
      }
    }

    Object.assign(customer, updateCustomerDto);
    await customerRepo.save(customer);

    return this.findById(id);
  }

  /**
   * Soft delete customer
   */
  async remove(id: string): Promise<void> {
    const customerRepo = await this.getCustomerRepository();
    const customer = await this.findById(id);

    // Check if has pending orders or dues
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const pendingOrders = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('sales_orders', 'so')
      .where('so.customer_id = :id', { id })
      .andWhere('so.status NOT IN (:...statuses)', {
        statuses: ['COMPLETED', 'CANCELLED', 'DELIVERED'],
      })
      .getRawOne();

    if (parseInt(pendingOrders.count) > 0) {
      throw new BadRequestException(
        'Cannot delete customer with pending orders',
      );
    }

    customer.deletedAt = new Date();
    await customerRepo.save(customer);
  }

  /**
   * Add address to customer
   */
  async addAddress(
    customerId: string,
    addressDto: CreateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const addressRepo = dataSource.getRepository(CustomerAddress);

    // Verify customer exists
    await this.findById(customerId);

    // If setting as default, unset other defaults
    if (addressDto.isDefault) {
      await addressRepo.update(
        { customerId, isDefault: true },
        { isDefault: false },
      );
    }

    const address = addressRepo.create({
      id: uuidv4(),
      customerId,
      ...addressDto,
    });

    return addressRepo.save(address);
  }

  /**
   * Update customer address
   */
  async updateAddress(
    addressId: string,
    addressDto: Partial<CreateCustomerAddressDto>,
  ): Promise<CustomerAddress> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const addressRepo = dataSource.getRepository(CustomerAddress);

    const address = await addressRepo.findOne({ where: { id: addressId } });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // If setting as default, unset other defaults
    if (addressDto.isDefault && !address.isDefault) {
      await addressRepo.update(
        { customerId: address.customerId, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, addressDto);
    return addressRepo.save(address);
  }

  /**
   * Remove customer address
   */
  async removeAddress(addressId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const addressRepo = dataSource.getRepository(CustomerAddress);

    await addressRepo.delete(addressId);
  }

  /**
   * Get customer addresses
   */
  async getAddresses(customerId: string): Promise<CustomerAddress[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const addressRepo = dataSource.getRepository(CustomerAddress);

    return addressRepo.find({
      where: { customerId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Get customer outstanding balance
   */
  async getOutstandingBalance(customerId: string): Promise<number> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const result = await dataSource
      .createQueryBuilder()
      .select(
        'SUM(cd.original_amount - cd.paid_amount - cd.adjusted_amount)',
        'balance',
      )
      .from('customer_dues', 'cd')
      .where('cd.customer_id = :customerId', { customerId })
      .andWhere('cd.status IN (:...statuses)', {
        statuses: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'],
      })
      .getRawOne();

    return parseFloat(result.balance) || 0;
  }

  /**
   * Get customer dues
   */
  async getDues(customerId: string): Promise<CustomerDue[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const dueRepo = dataSource.getRepository(CustomerDue);

    return dueRepo.find({
      where: { customerId },
      relations: ['salesOrder'],
      order: { dueDate: 'ASC' },
    });
  }

  /**
   * Get customer order history
   */
  async getOrderHistory(
    customerId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<any>> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const queryBuilder = dataSource
      .createQueryBuilder()
      .select([
        'so.id',
        'so.order_number as orderNumber',
        'so.order_date as orderDate',
        'so.status',
        'so.total_amount as totalAmount',
        'so.paid_amount as paidAmount',
      ])
      .from('sales_orders', 'so')
      .where('so.customer_id = :customerId', { customerId })
      .orderBy('so.order_date', 'DESC');

    return paginate(queryBuilder as any, paginationDto);
  }

  /**
   * Update customer credit limit
   */
  async updateCreditLimit(
    customerId: string,
    creditLimit: number,
  ): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();
    const customer = await this.findById(customerId);

    customer.creditLimit = creditLimit;
    await customerRepo.save(customer);

    return customer;
  }

  /**
   * Check credit limit
   */
  async checkCreditLimit(
    customerId: string,
    orderAmount: number,
  ): Promise<boolean> {
    const customer = await this.findById(customerId);

    if (!customer.creditLimit) {
      return true; // No limit set
    }

    const outstandingBalance = await this.getOutstandingBalance(customerId);
    const totalExposure = outstandingBalance + orderAmount;

    return totalExposure <= Number(customer.creditLimit);
  }

  /**
   * Count customers
   */
  async count(): Promise<number> {
    const customerRepo = await this.getCustomerRepository();
    return customerRepo.count({ where: { deletedAt: IsNull() } });
  }
}
