import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { Role } from '@entities/tenant/role/role.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { LeaveRequestStatus } from '@common/enums';
import { getNextSequence } from '@common/utils/sequence.util';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class EmployeesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<Employee>> {
    return this.tenantConnectionManager.getRepository(Employee);
  }

  /**
   * Create a person, optionally with a login and roles.
   *
   * Employee and user are one record, so this is the single place a member of
   * staff comes into existence. Supplying `password` gives them credentials;
   * `roleIds` then decides what they can do. The whole thing is one
   * transaction, so a bad role id cannot leave a half-created employee who
   * can sign in but has no permissions.
   */
  async create(dto: CreateEmployeeDto, createdBy?: string): Promise<Employee> {
    const { password, roleIds, ...employeeData } = dto;

    if (password && !dto.email) {
      throw new BadRequestException(
        'An email address is required to give an employee a login',
      );
    }
    if (roleIds?.length && !password) {
      throw new BadRequestException(
        'Roles can only be assigned to an employee who has a login',
      );
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();

    if (dto.email) {
      const clash = await dataSource
        .getRepository(Employee)
        .findOne({ where: { email: dto.email }, withDeleted: true });
      if (clash) {
        throw new BadRequestException(`Email ${dto.email} is already in use`);
      }
    }

    if (roleIds?.length) {
      const found = await dataSource
        .getRepository(Role)
        .createQueryBuilder('r')
        .where('r.id IN (:...ids)', { ids: roleIds })
        .getCount();
      if (found !== roleIds.length) {
        throw new BadRequestException('One or more role IDs are invalid');
      }
    }

    const employeeCode = await getNextSequence(dataSource, 'EMPLOYEE');
    const passwordHash = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : undefined;

    return dataSource.transaction(async (manager) => {
      const employee = manager.getRepository(Employee).create({
        ...employeeData,
        employeeCode,
        passwordHash,
        createdBy,
      });
      const saved = await manager.getRepository(Employee).save(employee);

      if (roleIds?.length) {
        const userRoleRepo = manager.getRepository(UserRole);
        await userRoleRepo.save(
          roleIds.map((roleId) =>
            userRoleRepo.create({
              userId: saved.id,
              roleId,
              assignedBy: createdBy,
            }),
          ),
        );
      }

      return saved;
    });
  }

  async findAll(params: {
    search?: string;
    departmentId?: string;
    designationId?: string;
    employmentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Employee[]; total: number }> {
    const {
      search,
      departmentId,
      designationId,
      employmentStatus,
      page = 1,
      limit = 20,
    } = params;
    const repo = await this.getRepo();
    const qb = repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.department', 'dept')
      .leftJoinAndSelect('e.designation', 'desig')
      .where('e.deleted_at IS NULL');

    if (search) {
      qb.andWhere(
        '(e.firstName LIKE :s OR e.lastName LIKE :s OR e.employeeCode LIKE :s OR e.email LIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (departmentId)
      qb.andWhere('e.departmentId = :departmentId', { departmentId });
    if (designationId)
      qb.andWhere('e.designationId = :designationId', { designationId });
    if (employmentStatus)
      qb.andWhere('e.employmentStatus = :employmentStatus', {
        employmentStatus,
      });

    const total = await qb.getCount();
    const data = await qb
      .orderBy('e.firstName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<Employee> {
    const repo = await this.getRepo();
    const employee = await repo.findOne({
      where: { id },
      relations: ['department', 'designation', 'manager'],
    });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    const repo = await this.getRepo();
    return repo.save(employee);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const employee = await this.findOne(id);
    await repo.softRemove(employee);
  }

  async getLeaveBalance(
    employeeId: string,
    year: number,
  ): Promise<
    Array<{
      leaveTypeId: string;
      leaveTypeName: string;
      used: number;
      maxDays: number;
    }>
  > {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const rows: any[] = await dataSource.query(
      `SELECT lt.id AS leaveTypeId, lt.name AS leaveTypeName,
              lt.max_days_per_year AS maxDays,
              COALESCE(SUM(lr.total_days), 0) AS used
       FROM hr_leave_types lt
       LEFT JOIN hr_leave_requests lr
         ON lr.leave_type_id = lt.id
         AND lr.employee_id = ?
         AND lr.status = ?
         AND YEAR(lr.from_date) = ?
         AND lr.deleted_at IS NULL
       WHERE lt.deleted_at IS NULL AND lt.is_active = 1
       GROUP BY lt.id, lt.name, lt.max_days_per_year`,
      [employeeId, LeaveRequestStatus.APPROVED, year],
    );
    return rows.map((r) => ({
      leaveTypeId: r.leaveTypeId,
      leaveTypeName: r.leaveTypeName,
      maxDays: Number(r.maxDays),
      used: Number(r.used),
      remaining:
        Number(r.maxDays) === 0 ? null : Number(r.maxDays) - Number(r.used),
    }));
  }
}
