"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CustomerGroupsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerGroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const tenant_1 = require("../../entities/tenant");
const tenant_connection_manager_1 = require("../../database/tenant-connection.manager");
let CustomerGroupsService = CustomerGroupsService_1 = class CustomerGroupsService {
    tenantConnectionManager;
    logger = new common_1.Logger(CustomerGroupsService_1.name);
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getGroupRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.CustomerGroup);
    }
    async getCustomerRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.Customer);
    }
    async create(createDto, createdBy) {
        this.logger.log(`Creating customer group: ${createDto.groupCode}`);
        const customerRepo = await this.getGroupRepo();
        const existingGroup = await customerRepo.findOne({
            where: { groupCode: createDto.groupCode.toUpperCase() },
        });
        if (existingGroup) {
            throw new common_1.ConflictException(`Customer group with code '${createDto.groupCode}' already exists`);
        }
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
        });
        const savedGroup = await customerRepo.save(customerGroup);
        this.logger.log(`Customer group created: ${savedGroup.id}`);
        return savedGroup;
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', } = paginationDto;
        const skip = (page - 1) * limit;
        const customerRepo = await this.getGroupRepo();
        const queryBuilder = customerRepo
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.priceList', 'priceList');
        if (search) {
            queryBuilder.andWhere('(group.groupCode LIKE :search OR group.groupName LIKE :search OR group.description LIKE :search)', { search: `%${search}%` });
        }
        const validSortFields = [
            'createdAt',
            'groupCode',
            'groupName',
            'discountPercentage',
            'creditLimit',
        ];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`group.${sortField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');
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
    async findAllSimple() {
        const customerRepo = await this.getGroupRepo();
        return customerRepo.find({
            where: { isActive: true },
            select: [
                'id',
                'groupCode',
                'groupName',
                'discountPercentage',
            ],
            order: { groupName: 'ASC' },
        });
    }
    async findOne(id) {
        const groupRepo = await this.getGroupRepo();
        const customerGroup = await groupRepo.findOne({
            where: { id },
            relations: ['priceList'],
        });
        if (!customerGroup) {
            throw new common_1.NotFoundException(`Customer group with ID '${id}' not found`);
        }
        return customerGroup;
    }
    async findByCode(groupCode) {
        const groupRepo = await this.getGroupRepo();
        const customerGroup = await groupRepo.findOne({
            where: { groupCode: groupCode.toUpperCase() },
            relations: ['priceList'],
        });
        if (!customerGroup) {
            throw new common_1.NotFoundException(`Customer group with code '${groupCode}' not found`);
        }
        return customerGroup;
    }
    async findDefault() {
        const groupRepo = await this.getGroupRepo();
        return groupRepo.findOne({
            where: { isActive: true },
        });
    }
    async update(id, updateDto, updatedBy) {
        const customerGroup = await this.findOne(id);
        if (updateDto.groupCode &&
            updateDto.groupCode.toUpperCase() !== customerGroup.groupCode) {
            const groupRepo = await this.getGroupRepo();
            const existingGroup = await groupRepo.findOne({
                where: { groupCode: updateDto.groupCode.toUpperCase() },
            });
            if (existingGroup) {
                throw new common_1.ConflictException(`Customer group with code '${updateDto.groupCode}' already exists`);
            }
        }
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
        const groupRepo = await this.getGroupRepo();
        const savedGroup = await groupRepo.save(customerGroup);
        this.logger.log(`Customer group updated: ${savedGroup.id}`);
        return this.findOne(savedGroup.id);
    }
    async remove(id) {
        const groupRepo = await this.getGroupRepo();
        const customerRepo = await this.getCustomerRepo();
        const customerGroup = await this.findOne(id);
        const customerCount = await customerRepo.count({
            where: { customerGroupId: id },
        });
        if (customerCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete customer group. ${customerCount} customer(s) are assigned to this group. Please reassign them first.`);
        }
        customerGroup.isActive = false;
        await groupRepo.save(customerGroup);
        this.logger.log(`Customer group deactivated: ${id}`);
    }
    async hardDelete(id) {
        const groupRepo = await this.getGroupRepo();
        const customerRepo = await this.getCustomerRepo();
        const customerGroup = await this.findOne(id);
        const customerCount = await customerRepo.count({
            where: { customerGroupId: id },
        });
        if (customerCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete customer group. ${customerCount} customer(s) are assigned to this group.`);
        }
        await groupRepo.delete(id);
        this.logger.log(`Customer group hard deleted: ${id}`);
    }
    async getCustomersInGroup(groupId, paginationDto) {
        await this.findOne(groupId);
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const customerRepo = await this.getCustomerRepo();
        const queryBuilder = customerRepo
            .createQueryBuilder('customer')
            .where('customer.customerGroupId = :groupId', { groupId })
            .andWhere('customer.deletedAt IS NULL');
        if (search) {
            queryBuilder.andWhere('(customer.customerCode LIKE :search OR customer.customerName LIKE :search)', { search: `%${search}%` });
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
    async getCustomerCountByGroup(groupId) {
        const customerRepo = await this.getCustomerRepo();
        return customerRepo.count({
            where: { customerGroupId: groupId, deletedAt: (0, typeorm_1.IsNull)() },
        });
    }
    async assignCustomersToGroup(groupId, customerIds) {
        const customerRepo = await this.getCustomerRepo();
        await this.findOne(groupId);
        const result = await customerRepo.update(customerIds.map((id) => ({ id })), { customerGroupId: groupId });
        this.logger.log(`Assigned ${result.affected} customers to group ${groupId}`);
        return { updated: result.affected || 0 };
    }
    async getStatistics() {
        const groupRepo = await this.getGroupRepo();
        const customerRepo = await this.getCustomerRepo();
        const [total, active, withDiscount, withCreditLimit] = await Promise.all([
            groupRepo.count(),
            groupRepo.count({ where: { isActive: true } }),
            groupRepo.count({
                where: { discountPercentage: (0, typeorm_1.Not)(0) },
            }),
            customerRepo.count({
                where: { creditLimit: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
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
};
exports.CustomerGroupsService = CustomerGroupsService;
exports.CustomerGroupsService = CustomerGroupsService = CustomerGroupsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], CustomerGroupsService);
//# sourceMappingURL=customer-groups.service.js.map