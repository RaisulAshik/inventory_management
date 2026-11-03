import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Employee } from '@entities/tenant/hr/employee.entity';
import { Role } from '@entities/tenant/role/role.entity';
import { UsersService } from '@modules/users/users.service';
import { LeaveRequestStatus } from '@common/enums';
import { RoleWithPermissions } from '@common/interfaces';
import { getNextSequence } from '@common/utils/sequence.util';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

/** An employee plus the roles of the user account sharing their email. */
export type EmployeeWithRoles = Employee & { roles: RoleWithPermissions[] };

@Injectable()
export class EmployeesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly usersService: UsersService,
  ) {}

  private async getRepo(): Promise<Repository<Employee>> {
    return this.tenantConnectionManager.getRepository(Employee);
  }

  /**
   * Create an employee, and optionally a login for them.
   *
   * The employee is an HR record in this tenant's database. When `password`
   * is supplied a USER is also created — in master `tenant_users`, mirrored
   * into this tenant's `users` under the same id, with the requested roles
   * granted in `user_roles` (see UsersService.create). The employee and the
   * user are NOT linked — there is no foreign key and nothing joins them — so
   * this is a convenience for the "new starter" form, not a relationship.
   *
   * Master and tenant are different databases, so a single transaction is
   * impossible. Everything that can be checked is checked before anything is
   * written, and if the login fails afterwards the employee is removed again
   * rather than left behind half-created.
   */
  async create(dto: CreateEmployeeDto, createdBy?: string): Promise<Employee> {
    const { password, roleIds, ...employeeData } = dto;
    const dataSource = await this.tenantConnectionManager.getDataSource();

    if (password && !dto.email) {
      throw new BadRequestException(
        'An email address is required to create a login',
      );
    }
    if (roleIds?.length && !password) {
      throw new BadRequestException(
        'Roles can only be granted alongside a login',
      );
    }

    // ── validate before writing anything ──────────────────────────────────
    if (dto.email) {
      const clash = await dataSource
        .getRepository(Employee)
        .findOne({ where: { email: dto.email }, withDeleted: true });
      if (clash) {
        throw new BadRequestException(
          `Email ${dto.email} is already used by another employee`,
        );
      }
    }

    if (password) {
      const existingUser = await this.usersService.findByEmail(dto.email!);
      if (existingUser) {
        throw new BadRequestException(
          `Email ${dto.email} already belongs to a user account`,
        );
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

    // ── write ─────────────────────────────────────────────────────────────
    const employeeCode = await getNextSequence(dataSource, 'EMPLOYEE');
    const repo = dataSource.getRepository(Employee);
    const employee = await repo.save(
      repo.create({ ...employeeData, employeeCode, createdBy }),
    );

    if (!password) return employee;

    try {
      await this.usersService.create(
        this.tenantConnectionManager.getTenantId()!,
        {
          email: dto.email!,
          password,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          employeeCode,
          roleIds,
          createdBy,
        },
      );
    } catch (error) {
      // The login could not be created, so undo the employee rather than
      // leave a record the caller did not ask for on its own.
      await repo.delete(employee.id);
      throw error;
    }

    return employee;
  }

  async findAll(params: {
    search?: string;
    departmentId?: string;
    designationId?: string;
    employmentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: EmployeeWithRoles[]; total: number }> {
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
    const rows = await qb
      .orderBy('e.firstName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data: await this.withRoles(rows), total };
  }

  /**
   * Attach each employee's roles, where they also have a login.
   *
   * Employees and users are unrelated records in different databases, so
   * there is no relation to load. Email is the only handle they share — it is
   * what the combined create form sets on both — and an employee without a
   * matching user simply comes back with an empty list.
   *
   * Batched into two extra queries for the whole page, not one per row.
   */
  private async withRoles(employees: Employee[]): Promise<EmployeeWithRoles[]> {
    // Annotated in place rather than spread into a new object: spreading
    // would drop the entity prototype and with it the fullName getter.
    const result = employees as EmployeeWithRoles[];
    for (const employee of result) employee.roles = [];

    const emails = result.map((e) => e.email).filter(Boolean);
    if (emails.length === 0) return result;

    const users = await this.usersService.findByEmails(emails);
    if (users.length === 0) return result;

    const rolesByUser = await this.usersService.getRolesForUsers(
      users.map((u) => u.id),
    );

    const rolesByEmail = new Map<string, RoleWithPermissions[]>();
    for (const user of users) {
      rolesByEmail.set(
        user.email.toLowerCase(),
        rolesByUser.get(user.id) ?? [],
      );
    }

    for (const employee of result) {
      employee.roles =
        rolesByEmail.get(employee.email?.toLowerCase() ?? '') ?? [];
    }

    return result;
  }

  async findOne(id: string): Promise<EmployeeWithRoles> {
    const repo = await this.getRepo();
    const employee = await repo.findOne({
      where: { id },
      relations: ['department', 'designation', 'manager'],
    });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    const [withRoles] = await this.withRoles([employee]);
    return withRoles;
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
