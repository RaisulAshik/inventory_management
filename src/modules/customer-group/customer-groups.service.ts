// src/modules/customer-groups/customer-groups.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull, DeepPartial } from 'typeorm';
import { CreateCustomerGroupDto } from './dto/create-customer-group.dto';
import { UpdateCustomerGroupDto } from './dto/update-customer-group.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { CustomerGroup, Customer } from '@/entities/tenant';
import { TenantConnectionManager } from '@/database/tenant-connection.manager';

@Injectable()
export class CustomerGroupsService {
  private readonly logger = new Logger(CustomerGroupsService.name);

  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  // Helper methods to get repos dynamically
  private async getGroupRepo(): Promise<Repository<CustomerGroup>> {
    return this.tenantConnectionManager.getRepository(CustomerGroup);
  }

  private async getCustomerRepo(): Promise<Repository<Customer>> {
    return this.tenantConnectionManager.getRepository(Customer);
  }

  // =====================================================
  // CREATE
  // =====================================================
  async create(
    createDto: CreateCustomerGroupDto,
    createdBy?: string,
  ): Promise<CustomerGroup> {
    this.logger.log(`Creating customer group: ${createDto.groupCode}`);

    const customerRepo = await this.getGroupRepo();
    // Check if group code already exists
    const existingGroup = await customerRepo.findOne({
      where: { groupCode: createDto.groupCode.toUpperCase() },
    });

    if (existingGroup) {
      throw new ConflictException(
        `Customer group with code '${createDto.groupCode}' already exists`,
      );
    }

    // Create customer group
    const customerGroup = customerRepo.create({
      groupCode: createDto.groupCode.toUpperCase(),
      groupName: createDto.groupName,
      description: createDto.description,
      discountPercentage: createDto.discountPercentage || 0,
      creditLimit: createDto.creditLimit,
      paymentTermDays: createDto.paymentTermDays,
      priceListId: createDto.priceListId,
      isDefault: createDto.isDefault || false,
      isActive: createDto.isActive ?? true,
      createdBy,
    } as DeepPartial<CustomerGroup>);

    // If this is set as default, unset other defaults
    // if (customerGroup.isDefault) {
    //   await this.customerGroupRepository.update(
    //     { isDefault: true },
    //     { isDefault: false },
    //   );
    // }

    const savedGroup = await customerRepo.save(customerGroup);
    this.logger.log(`Customer group created: ${savedGroup.id}`);

    return savedGroup;
  }

  // =====================================================
  // FIND ALL (with pagination)
  // =====================================================
  async findAll(paginationDto: PaginationDto): Promise<{
    data: CustomerGroup[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      //isActive,
    } = paginationDto;

    const skip = (page - 1) * limit;

    const customerRepo = await this.getGroupRepo();
    const queryBuilder = customerRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.priceList', 'priceList');

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(group.groupCode LIKE :search OR group.groupName LIKE :search OR group.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Active filter
    // if (isActive !== undefined) {
    //   queryBuilder.andWhere('group.isActive = :isActive', { isActive });
    // }

    // Sorting
    const validSortFields = [
      'createdAt',
      'groupCode',
      'groupName',
      'discountPercentage',
      'creditLimit',
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(
      `group.${sortField}`,
      sortOrder === 'ASC' ? 'ASC' : 'DESC',
    );

    // Pagination
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // =====================================================
  // FIND ALL (Simple - for dropdowns)
  // =====================================================
  async findAllSimple(): Promise<CustomerGroup[]> {
    const customerRepo = await this.getGroupRepo();
    return customerRepo.find({
      where: { isActive: true },
      select: [
        'id',
        'groupCode',
        'groupName',
        'discountPercentage',
        //'isDefault',
      ],
      order: { groupName: 'ASC' },
    });
  }

  // =====================================================
  // FIND ONE
  // =====================================================
  async findOne(id: string): Promise<CustomerGroup> {
    const groupRepo = await this.getGroupRepo();
    const customerGroup = await groupRepo.findOne({
      where: { id },
      relations: ['priceList'],
    });

    if (!customerGroup) {
      throw new NotFoundException(`Customer group with ID '${id}' not found`);
    }
    return customerGroup;
  }
  // =====================================================
  // FIND BY CODE
  // =====================================================
  async findByCode(groupCode: string): Promise<CustomerGroup> {
    const groupRepo = await this.getGroupRepo();
    const customerGroup = await groupRepo.findOne({
      where: { groupCode: groupCode.toUpperCase() },
      relations: ['priceList'],
    });

    if (!customerGroup) {
      throw new NotFoundException(
        `Customer group with code '${groupCode}' not found`,
      );
    }

    return customerGroup;
  }

  // =====================================================
  // FIND DEFAULT
  // =====================================================
  async findDefault(): Promise<CustomerGroup | null> {
    const groupRepo = await this.getGroupRepo();
    return groupRepo.findOne({
      where: { isActive: true },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================
  async update(
    id: string,
    updateDto: UpdateCustomerGroupDto,
    updatedBy?: string,
  ): Promise<CustomerGroup> {
    const customerGroup = await this.findOne(id);

    // Check code uniqueness if being changed
    if (
      updateDto.groupCode &&
      updateDto.groupCode.toUpperCase() !== customerGroup.groupCode
    ) {
      const groupRepo = await this.getGroupRepo();
      const existingGroup = await groupRepo.findOne({
        where: { groupCode: updateDto.groupCode.toUpperCase() },
      });

      if (existingGroup) {
        throw new ConflictException(
          `Customer group with code '${updateDto.groupCode}' already exists`,
        );
      }
    }

    // If setting as default, unset other defaults
    // if (updateDto.isDefault === true && !customerGroup.isDefault) {
    //   await this.customerGroupRepository.update(
    //     //{ isDefault: true },
    //     { isDefault: false },
    //   );
    // }

    // Update fields
    if (updateDto.groupCode !== undefined) {
      customerGroup.groupCode = updateDto.groupCode.toUpperCase();
    }
    if (updateDto.groupName !== undefined) {
      customerGroup.groupName = updateDto.groupName;
    }
    if (updateDto.description !== undefined) {
      customerGroup.description = updateDto.description;
    }
    if (updateDto.discountPercentage !== undefined) {
      customerGroup.discountPercentage = updateDto.discountPercentage;
    }
    if (updateDto.creditLimit !== undefined) {
      customerGroup.creditLimit = updateDto.creditLimit;
    }
    if (updateDto.paymentTermsDays !== undefined) {
      customerGroup.paymentTermsDays = updateDto.paymentTermsDays;
    }
    if (updateDto.defaultPriceListId !== undefined) {
      customerGroup.defaultPriceListId = updateDto.defaultPriceListId;
    }
    if (updateDto.isActive !== undefined) {
      customerGroup.isActive = updateDto.isActive;
    }

    //customerGroup.updatedBy = updatedBy;
    const groupRepo = await this.getGroupRepo();
    const savedGroup = await groupRepo.save(customerGroup);
    this.logger.log(`Customer group updated: ${savedGroup.id}`);

    return this.findOne(savedGroup.id);
  }

  // =====================================================
  // DELETE (Soft delete by deactivating)
  // =====================================================
  async remove(id: string): Promise<void> {
    // 1. Get dynamic repositories
    const groupRepo = await this.getGroupRepo();
    const customerRepo = await this.getCustomerRepo();

    // 2. findOne already uses getGroupRepo() internally if refactored
    const customerGroup = await this.findOne(id);

    // 3. Check if there are customers using this group
    const customerCount = await customerRepo.count({
      where: { customerGroupId: id },
    });

    if (customerCount > 0) {
      throw new BadRequestException(
        `Cannot delete customer group. ${customerCount} customer(s) are assigned to this group. Please reassign them first.`,
      );
    }

    // 4. Soft delete - just deactivate
    customerGroup.isActive = false;
    await groupRepo.save(customerGroup);

    this.logger.log(`Customer group deactivated: ${id}`);
  }

  // =====================================================
  // HARD DELETE
  // =====================================================
  async hardDelete(id: string): Promise<void> {
    const groupRepo = await this.getGroupRepo();
    const customerRepo = await this.getCustomerRepo();
    const customerGroup = await this.findOne(id);

    // Check if there are customers using this group
    const customerCount = await customerRepo.count({
      where: { customerGroupId: id },
    });

    if (customerCount > 0) {
      throw new BadRequestException(
        `Cannot delete customer group. ${customerCount} customer(s) are assigned to this group.`,
      );
    }

    await groupRepo.delete(id);
    this.logger.log(`Customer group hard deleted: ${id}`);
  }

  // =====================================================
  // GET CUSTOMERS IN GROUP
  // =====================================================
  async getCustomersInGroup(
    groupId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Verify group exists
    await this.findOne(groupId);

    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const customerRepo = await this.getCustomerRepo();
    const queryBuilder = customerRepo
      .createQueryBuilder('customer')
      .where('customer.customerGroupId = :groupId', { groupId })
      .andWhere('customer.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(customer.customerCode LIKE :search OR customer.customerName LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('customer.customerName', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // =====================================================
  // GET CUSTOMER COUNT BY GROUP
  // =====================================================
  async getCustomerCountByGroup(groupId: string): Promise<number> {
    // Verify group exists

    const customerRepo = await this.getCustomerRepo();
    return customerRepo.count({
      where: { customerGroupId: groupId, deletedAt: IsNull() },
    });
  }

  // =====================================================
  // BULK UPDATE CUSTOMERS' GROUP
  // =====================================================
  async assignCustomersToGroup(
    groupId: string,
    customerIds: string[],
  ): Promise<{ updated: number }> {
    // Verify group exists

    const customerRepo = await this.getCustomerRepo();
    await this.findOne(groupId);

    const result = await customerRepo.update(
      customerIds.map((id) => ({ id })) as any,
      { customerGroupId: groupId },
    );

    this.logger.log(
      `Assigned ${result.affected} customers to group ${groupId}`,
    );

    return { updated: result.affected || 0 };
  }

  // =====================================================
  // STATISTICS
  // =====================================================
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withDiscount: number;
    withCreditLimit: number;
  }> {
    const groupRepo = await this.getGroupRepo();
    const customerRepo = await this.getCustomerRepo();
    const [total, active, withDiscount, withCreditLimit] = await Promise.all([
      groupRepo.count(),
      groupRepo.count({ where: { isActive: true } }),
      groupRepo.count({
        where: { discountPercentage: Not(0) },
      }),
      customerRepo.count({
        where: { creditLimit: Not(IsNull()) },
      }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      withDiscount,
      withCreditLimit,
    };
  }
}
