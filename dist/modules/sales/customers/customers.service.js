"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcrypt"));
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
let CustomersService = class CustomersService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getCustomerRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.Customer);
    }
    async create(createCustomerDto, createdBy) {
        const customerRepo = await this.getCustomerRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const customerCode = createCustomerDto.customerCode ||
            (await (0, sequence_util_1.getNextSequence)(dataSource, 'CUSTOMER'));
        const existingCustomer = await customerRepo.findOne({
            where: { customerCode },
        });
        if (existingCustomer) {
            throw new common_1.BadRequestException(`Customer with code ${customerCode} already exists`);
        }
        if (createCustomerDto.email) {
            const existingEmail = await customerRepo.findOne({
                where: { email: createCustomerDto.email },
            });
            if (existingEmail) {
                throw new common_1.BadRequestException(`Customer with email ${createCustomerDto.email} already exists`);
            }
        }
        const customer = customerRepo.create({
            id: (0, uuid_1.v4)(),
            ...createCustomerDto,
            customerCode,
            createdBy,
        });
        const savedCustomer = await customerRepo.save(customer);
        if (createCustomerDto.addresses && createCustomerDto.addresses.length > 0) {
            await this.createAddresses(savedCustomer.id, createCustomerDto.addresses, dataSource);
        }
        if (createCustomerDto.password && createCustomerDto.email) {
            await this.createCredentials(savedCustomer.id, createCustomerDto.email, createCustomerDto.password, dataSource);
        }
        return this.findById(savedCustomer.id);
    }
    async createAddresses(customerId, addresses, dataSource) {
        const addressRepo = dataSource.getRepository(tenant_1.CustomerAddress);
        for (let i = 0; i < addresses.length; i++) {
            const addressDto = addresses[i];
            const address = addressRepo.create({
                id: (0, uuid_1.v4)(),
                customerId,
                ...addressDto,
                isDefault: addressDto.isDefault ?? i === 0,
            });
            await addressRepo.save(address);
        }
    }
    async createCredentials(customerId, email, password, dataSource) {
        const credentialsRepo = dataSource.getRepository(tenant_1.CustomerCredentials);
        const passwordHash = await bcrypt.hash(password, 10);
        const credentials = credentialsRepo.create({
            id: (0, uuid_1.v4)(),
            customerId,
            passwordHash,
            emailVerified: false,
        });
        await credentialsRepo.save(credentials);
    }
    async findAll(filterDto) {
        const customerRepo = await this.getCustomerRepository();
        const queryBuilder = customerRepo
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.customerGroup', 'customerGroup')
            .leftJoinAndSelect('customer.priceList', 'priceList')
            .where('customer.deletedAt IS NULL');
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
        if (filterDto.search) {
            queryBuilder.andWhere('(customer.customerCode LIKE :search OR customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.companyName LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search)', { search: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'createdAt';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, filterDto);
    }
    async findById(id) {
        const customerRepo = await this.getCustomerRepository();
        const customer = await customerRepo.findOne({
            where: { id },
            relations: ['customerGroup', 'priceList', 'addresses'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async findByEmail(email) {
        const customerRepo = await this.getCustomerRepository();
        return customerRepo.findOne({
            where: { email },
            relations: ['customerGroup', 'priceList'],
        });
    }
    async findByCode(code) {
        const customerRepo = await this.getCustomerRepository();
        return customerRepo.findOne({
            where: { customerCode: code },
        });
    }
    async update(id, updateCustomerDto) {
        const customerRepo = await this.getCustomerRepository();
        const customer = await this.findById(id);
        if (updateCustomerDto.customerCode &&
            updateCustomerDto.customerCode !== customer.customerCode) {
            const existingCode = await customerRepo.findOne({
                where: { customerCode: updateCustomerDto.customerCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Customer with code ${updateCustomerDto.customerCode} already exists`);
            }
        }
        if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
            const existingEmail = await customerRepo.findOne({
                where: { email: updateCustomerDto.email },
            });
            if (existingEmail) {
                throw new common_1.BadRequestException(`Customer with email ${updateCustomerDto.email} already exists`);
            }
        }
        Object.assign(customer, updateCustomerDto);
        await customerRepo.save(customer);
        return this.findById(id);
    }
    async remove(id) {
        const customerRepo = await this.getCustomerRepository();
        const customer = await this.findById(id);
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
            throw new common_1.BadRequestException('Cannot delete customer with pending orders');
        }
        customer.deletedAt = new Date();
        await customerRepo.save(customer);
    }
    async addAddress(customerId, addressDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const addressRepo = dataSource.getRepository(tenant_1.CustomerAddress);
        await this.findById(customerId);
        if (addressDto.isDefault) {
            await addressRepo.update({ customerId, isDefault: true }, { isDefault: false });
        }
        const address = addressRepo.create({
            id: (0, uuid_1.v4)(),
            customerId,
            ...addressDto,
        });
        return addressRepo.save(address);
    }
    async updateAddress(addressId, addressDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const addressRepo = dataSource.getRepository(tenant_1.CustomerAddress);
        const address = await addressRepo.findOne({ where: { id: addressId } });
        if (!address) {
            throw new common_1.NotFoundException(`Address with ID ${addressId} not found`);
        }
        if (addressDto.isDefault && !address.isDefault) {
            await addressRepo.update({ customerId: address.customerId, isDefault: true }, { isDefault: false });
        }
        Object.assign(address, addressDto);
        return addressRepo.save(address);
    }
    async removeAddress(addressId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const addressRepo = dataSource.getRepository(tenant_1.CustomerAddress);
        await addressRepo.delete(addressId);
    }
    async getAddresses(customerId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const addressRepo = dataSource.getRepository(tenant_1.CustomerAddress);
        return addressRepo.find({
            where: { customerId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }
    async getOutstandingBalance(customerId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const result = await dataSource
            .createQueryBuilder()
            .select('SUM(cd.original_amount - cd.paid_amount - cd.adjusted_amount)', 'balance')
            .from('customer_dues', 'cd')
            .where('cd.customer_id = :customerId', { customerId })
            .andWhere('cd.status IN (:...statuses)', {
            statuses: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'],
        })
            .getRawOne();
        return parseFloat(result.balance) || 0;
    }
    async getDues(customerId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const dueRepo = dataSource.getRepository(tenant_1.CustomerDue);
        return dueRepo.find({
            where: { customerId },
            relations: ['salesOrder'],
            order: { dueDate: 'ASC' },
        });
    }
    async getOrderHistory(customerId, paginationDto) {
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
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async updateCreditLimit(customerId, creditLimit) {
        const customerRepo = await this.getCustomerRepository();
        const customer = await this.findById(customerId);
        customer.creditLimit = creditLimit;
        await customerRepo.save(customer);
        return customer;
    }
    async checkCreditLimit(customerId, orderAmount) {
        const customer = await this.findById(customerId);
        if (!customer.creditLimit) {
            return true;
        }
        const outstandingBalance = await this.getOutstandingBalance(customerId);
        const totalExposure = outstandingBalance + orderAmount;
        return totalExposure <= Number(customer.creditLimit);
    }
    async count() {
        const customerRepo = await this.getCustomerRepository();
        return customerRepo.count({ where: { deletedAt: (0, typeorm_1.IsNull)() } });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], CustomersService);
//# sourceMappingURL=customers.service.js.map