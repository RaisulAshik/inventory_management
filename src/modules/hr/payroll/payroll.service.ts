import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { HrPayroll } from '@entities/tenant/hr/payroll.entity';
import { PayrollComponent } from '@entities/tenant/hr/payroll-component.entity';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { HrPayrollStatus, PayrollComponentType } from '@common/enums';
import { getNextSequence } from '@common/utils/sequence.util';
import { CreatePayrollDto } from './dto/create-payroll.dto';

/** Calendar days in a month, used when no attendance has been recorded. */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

@Injectable()
export class PayrollService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  async process(dto: CreatePayrollDto, createdBy?: string): Promise<HrPayroll> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate employee exists
    const employee = await dataSource
      .getRepository(Employee)
      .findOne({ where: { id: dto.employeeId } });
    if (!employee)
      throw new NotFoundException(`Employee ${dto.employeeId} not found`);

    // Check for duplicate payroll
    const existing = await dataSource.getRepository(HrPayroll).findOne({
      where: {
        employeeId: dto.employeeId,
        payrollMonth: dto.payrollMonth,
        payrollYear: dto.payrollYear,
      },
      withDeleted: false,
    });
    if (existing) {
      throw new BadRequestException(
        `Payroll already exists for ${employee.employeeCode} - ${dto.payrollMonth}/${dto.payrollYear}`,
      );
    }

    const payrollNumber = await getNextSequence(dataSource, 'PAYROLL');

    // Attendance is read from the recorded attendance for the period rather
    // than taken on trust from the request body. The caller may still override
    // each figure explicitly, but the default is what actually happened.
    const [attendance] = await dataSource.query(
      `SELECT
         COALESCE(SUM(status = 'PRESENT'), 0) AS present,
         COALESCE(SUM(status = 'LATE'), 0)    AS late,
         COALESCE(SUM(status = 'HALF_DAY'), 0) AS halfDay,
         COALESCE(SUM(status = 'ABSENT'), 0)  AS absent,
         COALESCE(SUM(status = 'LEAVE'), 0)   AS onLeave,
         COALESCE(SUM(overtime_hours), 0)     AS overtimeHours,
         COUNT(*)                             AS recorded
       FROM hr_attendance
       WHERE employee_id = ? AND YEAR(attendance_date) = ? AND MONTH(attendance_date) = ?`,
      [dto.employeeId, dto.payrollYear, dto.payrollMonth],
    );

    const recorded = Number(attendance?.recorded ?? 0);
    // A half day counts as half a day present.
    const presentFromAttendance =
      Number(attendance?.present ?? 0) +
      Number(attendance?.late ?? 0) +
      Number(attendance?.halfDay ?? 0) / 2;

    const workingDays =
      dto.workingDays ??
      (recorded > 0
        ? recorded - Number(attendance?.onLeave ?? 0)
        : daysInMonth(dto.payrollYear, dto.payrollMonth));
    const presentDays =
      dto.presentDays ?? (recorded > 0 ? presentFromAttendance : workingDays);
    const absentDays =
      dto.absentDays ??
      (recorded > 0
        ? Number(attendance.absent)
        : Math.max(0, workingDays - presentDays));
    const leaveDays = dto.leaveDays ?? Number(attendance?.onLeave ?? 0);
    const overtimeHours =
      dto.overtimeHours ?? Number(attendance?.overtimeHours ?? 0);

    if (presentDays > workingDays) {
      throw new BadRequestException(
        `presentDays (${presentDays}) cannot exceed workingDays (${workingDays})`,
      );
    }

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
        workingDays,
        presentDays,
        absentDays,
        leaveDays,
        overtimeHours,
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
        manager
          .getRepository(PayrollComponent)
          .create({ ...c, payrollId: saved.id }),
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
    const qb = dataSource
      .getRepository(HrPayroll)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.employee', 'emp')
      .where('p.deleted_at IS NULL');

    if (employeeId) qb.andWhere('p.employeeId = :employeeId', { employeeId });
    if (month) qb.andWhere('p.payrollMonth = :month', { month });
    if (year) qb.andWhere('p.payrollYear = :year', { year });
    if (status) qb.andWhere('p.status = :status', { status });

    const total = await qb.getCount();
    const data = await qb
      .orderBy('p.payrollYear', 'DESC')
      .addOrderBy('p.payrollMonth', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
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

  /**
   * Approve a payroll run.
   *
   * Locked for the duration, and whoever processed the run cannot approve it.
   */
  async approve(
    id: string,
    approverId: string,
    selfApprovalAllowed = false,
  ): Promise<HrPayroll> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    await dataSource.transaction(async (manager) => {
      const payroll = await manager.getRepository(HrPayroll).findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payroll) throw new NotFoundException(`Payroll ${id} not found`);

      if (payroll.status !== HrPayrollStatus.DRAFT) {
        throw new BadRequestException(
          `Cannot approve a payroll with status ${payroll.status}`,
        );
      }
      // `createdBy` (a master user id), not `employeeId` (a tenant employee
      // id): users and employees are unrelated records in different databases,
      // so those two ids could never match.
      if (
        !selfApprovalAllowed &&
        payroll.createdBy &&
        payroll.createdBy === approverId
      ) {
        throw new ForbiddenException(
          'You cannot approve a payroll run you processed',
        );
      }

      payroll.status = HrPayrollStatus.APPROVED;
      payroll.approvedBy = approverId;
      payroll.approvedAt = new Date();

      await manager.getRepository(HrPayroll).save(payroll);
    });

    return this.findOne(id);
  }

  async markPaid(
    id: string,
    paidBy: string,
    paymentDate?: string,
    selfApprovalAllowed = false,
  ): Promise<HrPayroll> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    await dataSource.transaction(async (manager) => {
      const payroll = await manager.getRepository(HrPayroll).findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payroll) throw new NotFoundException(`Payroll ${id} not found`);

      if (payroll.status !== HrPayrollStatus.APPROVED) {
        throw new BadRequestException(
          'Only approved payrolls can be marked as paid',
        );
      }
      if (
        !selfApprovalAllowed &&
        payroll.createdBy &&
        payroll.createdBy === paidBy
      ) {
        throw new ForbiddenException(
          'You cannot pay out a payroll run you processed',
        );
      }

      payroll.status = HrPayrollStatus.PAID;
      payroll.paymentDate = paymentDate ? new Date(paymentDate) : new Date();

      await manager.getRepository(HrPayroll).save(payroll);
    });

    return this.findOne(id);
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
