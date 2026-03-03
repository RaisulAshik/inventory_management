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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRemindersService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
const payment_reminder_entity_1 = require("../../../entities/tenant/dueManagement/payment-reminder.entity");
let PaymentRemindersService = class PaymentRemindersService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(payment_reminder_entity_1.PaymentReminder);
    }
    async getDataSource() {
        return this.tenantConnectionManager.getDataSource();
    }
    async findAll(filterDto) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.customer', 'customer')
            .leftJoinAndSelect('r.customerDue', 'due');
        if (filterDto.status)
            qb.andWhere('r.status = :status', { status: filterDto.status });
        if (filterDto.reminderType)
            qb.andWhere('r.reminderType = :type', { type: filterDto.reminderType });
        if (filterDto.customerId)
            qb.andWhere('r.customerId = :cid', { cid: filterDto.customerId });
        if (filterDto.customerDueId)
            qb.andWhere('r.customerDueId = :did', { did: filterDto.customerDueId });
        if (filterDto.fromDate)
            qb.andWhere('r.reminderDate >= :from', { from: filterDto.fromDate });
        if (filterDto.toDate)
            qb.andWhere('r.reminderDate <= :to', { to: filterDto.toDate });
        if (filterDto.followUpToday) {
            const today = new Date().toISOString().split('T')[0];
            qb.andWhere('r.followUpRequired = 1');
            qb.andWhere('r.followUpDate <= :today', { today });
            qb.andWhere('r.status = :sent', { sent: payment_reminder_entity_1.ReminderStatus.SENT });
        }
        if (filterDto.brokenPromises) {
            const today = new Date().toISOString().split('T')[0];
            qb.andWhere('r.promiseToPayDate IS NOT NULL');
            qb.andWhere('r.promiseToPayDate < :today', { today });
            qb.andWhere('due.status NOT IN (:...paid)', {
                paid: [enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF],
            });
        }
        if (filterDto.search) {
            qb.andWhere('(customer.firstName LIKE :s OR customer.lastName LIKE :s OR customer.companyName LIKE :s OR due.referenceNumber LIKE :s)', { s: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'reminderDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(qb, filterDto);
    }
    async findById(id) {
        const repo = await this.getRepo();
        const r = await repo.findOne({
            where: { id },
            relations: ['customer', 'customerDue'],
        });
        if (!r)
            throw new common_1.NotFoundException(`Reminder ${id} not found`);
        return r;
    }
    async findByDue(dueId) {
        const repo = await this.getRepo();
        return repo.find({
            where: { customerDueId: dueId },
            relations: ['customer'],
            order: { reminderDate: 'DESC' },
        });
    }
    async getFollowUpsToday() {
        const repo = await this.getRepo();
        const today = new Date().toISOString().split('T')[0];
        return repo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.customer', 'customer')
            .leftJoinAndSelect('r.customerDue', 'due')
            .where('r.followUpRequired = 1')
            .andWhere('r.followUpDate <= :today', { today })
            .andWhere('r.status = :sent', { sent: payment_reminder_entity_1.ReminderStatus.SENT })
            .orderBy('r.followUpDate', 'ASC')
            .getMany();
    }
    async getBrokenPromises() {
        const repo = await this.getRepo();
        const today = new Date().toISOString().split('T')[0];
        return repo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.customer', 'customer')
            .leftJoinAndSelect('r.customerDue', 'due')
            .where('r.promiseToPayDate IS NOT NULL')
            .andWhere('r.promiseToPayDate < :today', { today })
            .andWhere('due.status NOT IN (:...paid)', {
            paid: [enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF],
        })
            .orderBy('r.promiseToPayDate', 'ASC')
            .getMany();
    }
    async createManual(dto, userId) {
        const repo = await this.getRepo();
        let overdueAmount = null;
        let overdueDays = null;
        if (dto.customerDueId) {
            const ds = await this.getDataSource();
            const dueRepo = ds.getRepository(tenant_1.CustomerDue);
            const due = await dueRepo.findOne({ where: { id: dto.customerDueId } });
            if (due) {
                overdueAmount =
                    Number(due.originalAmount) -
                        Number(due.paidAmount) -
                        Number(due.adjustedAmount) -
                        Number(due.writtenOffAmount);
                const diff = new Date().getTime() - new Date(due.dueDate).getTime();
                overdueDays = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
            }
        }
        const reminder = repo.create({
            id: (0, uuid_1.v4)(),
            customerId: dto.customerId,
            customerDueId: dto.customerDueId,
            reminderType: dto.reminderType,
            status: payment_reminder_entity_1.ReminderStatus.SCHEDULED,
            reminderDate: dto.reminderDate,
            scheduledTime: dto.scheduledTime,
            subject: dto.subject,
            message: dto.message,
            recipientEmail: dto.recipientEmail,
            recipientPhone: dto.recipientPhone,
            overdueAmount,
            overdueDays,
            reminderLevel: 1,
            notes: dto.notes,
            createdBy: userId,
        });
        return repo.save(reminder);
    }
    async createAutomated(due, level, reminderType = payment_reminder_entity_1.ReminderType.EMAIL) {
        const repo = await this.getRepo();
        const balance = Number(due.originalAmount) -
            Number(due.paidAmount) -
            Number(due.adjustedAmount) -
            Number(due.writtenOffAmount);
        const diff = new Date().getTime() - new Date(due.dueDate).getTime();
        const overdueDays = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        const customerName = due.customer
            ? `${due.customer.firstName || ''} ${due.customer.lastName || ''}`.trim() ||
                due.customer.companyName ||
                ''
            : 'Customer';
        const subject = level <= 2
            ? `Payment Reminder - ${due.referenceNumber}`
            : `URGENT: Payment Overdue ${overdueDays} Days - ${due.referenceNumber}`;
        const message = this.buildReminderMessage(customerName, due.referenceNumber, balance, due.currency, overdueDays, level);
        const reminder = repo.create({
            id: (0, uuid_1.v4)(),
            customerId: due.customerId,
            customerDueId: due.id,
            reminderType,
            status: payment_reminder_entity_1.ReminderStatus.SENT,
            reminderDate: new Date().toISOString().split('T')[0],
            sentAt: new Date(),
            subject,
            message,
            recipientEmail: due.customer?.email || null,
            recipientPhone: due.customer?.phone || null,
            overdueAmount: balance,
            overdueDays,
            reminderLevel: level,
            followUpRequired: level >= 3,
            followUpDate: level >= 3
                ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                : null,
        });
        return repo.save(reminder);
    }
    async markSent(id, userId) {
        const repo = await this.getRepo();
        const r = await this.findById(id);
        if (r.status !== payment_reminder_entity_1.ReminderStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled reminders can be marked sent');
        }
        r.status = payment_reminder_entity_1.ReminderStatus.SENT;
        r.sentAt = new Date();
        r.sentBy = userId;
        return repo.save(r);
    }
    async markDelivered(id) {
        const repo = await this.getRepo();
        const r = await this.findById(id);
        r.status = payment_reminder_entity_1.ReminderStatus.DELIVERED;
        return repo.save(r);
    }
    async markFailed(id, reason) {
        const repo = await this.getRepo();
        const r = await this.findById(id);
        r.status = payment_reminder_entity_1.ReminderStatus.FAILED;
        r.notes = r.notes ? `${r.notes}\nFailed: ${reason}` : `Failed: ${reason}`;
        return repo.save(r);
    }
    async recordResponse(id, dto, userId) {
        const repo = await this.getRepo();
        const r = await this.findById(id);
        r.responseReceived = dto.responseReceived;
        r.responseDate = dto.responseDate ? new Date(dto.responseDate) : new Date();
        r.responseNotes = dto.responseNotes || '';
        if (dto.promiseToPayDate) {
            r.promiseToPayDate = new Date(dto.promiseToPayDate);
            if (dto.promisedAmount !== undefined) {
                r.promisedAmount = dto.promisedAmount;
            }
        }
        if (dto.followUpRequired !== undefined) {
            r.followUpRequired = dto.followUpRequired;
        }
        if (dto.followUpDate) {
            r.followUpDate = new Date(dto.followUpDate);
            r.followUpRequired = true;
        }
        return repo.save(r);
    }
    async cancel(id, userId) {
        const repo = await this.getRepo();
        const r = await this.findById(id);
        if (r.status !== payment_reminder_entity_1.ReminderStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled reminders can be cancelled');
        }
        r.status = payment_reminder_entity_1.ReminderStatus.CANCELLED;
        return repo.save(r);
    }
    buildReminderMessage(name, refNo, balance, currency, days, level) {
        if (level <= 1) {
            return `Dear ${name},\n\nThis is a friendly reminder that payment of ${currency} ${balance.toFixed(2)} for ${refNo} is now due. Please arrange payment at your earliest convenience.\n\nThank you.`;
        }
        if (level <= 3) {
            return `Dear ${name},\n\nWe notice that payment of ${currency} ${balance.toFixed(2)} for ${refNo} is overdue by ${days} days. Kindly arrange the payment immediately to avoid any inconvenience.\n\nThank you.`;
        }
        return `Dear ${name},\n\nThis is an URGENT notice regarding overdue payment of ${currency} ${balance.toFixed(2)} for ${refNo}, now ${days} days past due. Please contact us immediately to resolve this matter.\n\nThank you.`;
    }
};
exports.PaymentRemindersService = PaymentRemindersService;
exports.PaymentRemindersService = PaymentRemindersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], PaymentRemindersService);
//# sourceMappingURL=payment-reminders.service.js.map