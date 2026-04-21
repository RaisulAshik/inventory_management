import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { HrPayroll } from '@entities/tenant/hr/payroll.entity';
import { PayrollComponent } from '@entities/tenant/hr/payroll-component.entity';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { HrPayrollStatus, PayrollComponentType } from '@common/enums';
import { getNextSequence } from '@common/utils/sequence.util';
import { CreatePayrollDto } from './dto/create-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  async process(dto: CreatePayrollDto, createdBy?: string): Promise<HrPayroll> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate employee exists
    const employee = await dataSource.getRepository(Employee).findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException(`Employee ${dto.employeeId} not found`);

    // Check for duplicate payroll
    const existing = await dataSource.getRepository(HrPayroll).findOne({
      where: { employeeId: dto.employeeId, payrollMonth: dto.payrollMonth, payrollYear: dto.payrollYear },
      withDeleted: false,
    });
    if (existing) {
      throw new BadRequestException(
        `Payroll already exists for ${employee.employeeCode} - ${dto.payrollMonth}/${dto.payrollYear}`,
      );
    }

    const payrollNumber = await getNextSequence(dataSource, 'PAYROLL');

    return dataSource.transaction(async (manager) => {
      const basicSalary = Number(employee.basicSalary);

      // Build components: always include basic salary as first EARNING
      const components: Partial<PayrollComponent>[] = [
        {
          componentName: 'Basic Salary',
          componentType: PayrollComponentType.EARNING,
          amount: basicSalary,
        },
        ...(dto.components ?? []),
      ];

      const totalEarnings = components
        .filter((c) => c.componentType === PayrollComponentType.EARNING)
        .reduce((sum, c) => sum + Number(c.amount), 0);

      const totalDeductions = components
        .filter((c) => c.componentType === PayrollComponentType.DEDUCTION)
        .reduce((sum, c) => sum + Number(c.amount), 0);

      const payroll = manager.getRepository(HrPayroll).create({
        payrollNumber,
        employeeId: dto.employeeId,
        payrollMonth: dto.payrollMonth,
        payrollYear: dto.payrollYear,
        workingDays: dto.workingDays,
        presentDays: dto.presentDays,
        absentDays: dto.absentDays ?? (dto.workingDays - dto.presentDays),
        leaveDays: dto.leaveDays ?? 0,
        overtimeHours: dto.overtimeHours ?? 0,
        basicSalary,
        totalEarnings,
        totalDeductions,
        netPay: totalEarnings - totalDeductions,
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : undefined,
        notes: dto.notes,
        status: HrPayrollStatus.DRAFT,
        createdBy,
      });

      const saved = await manager.getRepository(HrPayroll).save(payroll);

      const componentEntities = components.map((c) =>
        manager.getRepository(PayrollComponent).create({ ...c, payrollId: saved.id }),
      );
      await manager.getRepository(PayrollComponent).save(componentEntities);

      const result = await manager.getRepository(HrPayroll).findOne({
        where: { id: saved.id },
        relations: ['employee', 'components'],
      });
      return result!;
    });
  }

  async findAll(params: {
    employeeId?: string;
    month?: number;
    year?: number;
    status?: HrPayrollStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: HrPayroll[]; total: number }> {
    const { employeeId, month, year, status, page = 1, limit = 20 } = params;
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const qb = dataSource.getRepository(HrPayroll).createQueryBuilder('p')
      .leftJoinAndSelect('p.employee', 'emp')
      .where('p.deleted_at IS NULL');

    if (employeeId) qb.andWhere('p.employeeId = :employeeId', { employeeId });
    if (month) qb.andWhere('p.payrollMonth = :month', { month });
    if (year) qb.andWhere('p.payrollYear = :year', { year });
    if (status) qb.andWhere('p.status = :status', { status });

    const total = await qb.getCount();
    const data = await qb.orderBy('p.payrollYear', 'DESC').addOrderBy('p.payrollMonth', 'DESC')
      .skip((page - 1) * limit).take(limit).getMany();
    return { data, total };
  }

  async findOne(id: string): Promise<HrPayroll> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const item = await dataSource.getRepository(HrPayroll).findOne({
      where: { id },
      relations: ['employee', 'components'],
    });
    if (!item) throw new NotFoundException(`Payroll ${id} not found`);
    return item;
  }

  async approve(id: string, approverId: string): Promise<HrPayroll> {
    const payroll = await this.findOne(id);
    if (payroll.status !== HrPayrollStatus.DRAFT) {
      throw new BadRequestException(`Cannot approve a payroll with status ${payroll.status}`);
    }
    payroll.status = HrPayrollStatus.APPROVED;
    payroll.approvedBy = approverId;
    payroll.approvedAt = new Date();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    return dataSource.getRepository(HrPayroll).save(payroll);
  }

  async markPaid(id: string, paymentDate?: string): Promise<HrPayroll> {
    const payroll = await this.findOne(id);
    if (payroll.status !== HrPayrollStatus.APPROVED) {
      throw new BadRequestException('Only approved payrolls can be marked as paid');
    }
    payroll.status = HrPayrollStatus.PAID;
    payroll.paymentDate = paymentDate ? new Date(paymentDate) : new Date();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    return dataSource.getRepository(HrPayroll).save(payroll);
  }

  async remove(id: string): Promise<void> {
    const payroll = await this.findOne(id);
    if (payroll.status !== HrPayrollStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT payrolls can be deleted');
    }
    const dataSource = await this.tenantConnectionManager.getDataSource();
    await dataSource.getRepository(HrPayroll).softRemove(payroll);
  }
}
