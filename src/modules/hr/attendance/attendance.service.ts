import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Attendance } from '@entities/tenant/hr/attendance.entity';
import { AttendanceStatus } from '@common/enums';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly tenantConnectionManager: TenantConnectionManager) {}

  private async getRepo(): Promise<Repository<Attendance>> {
    return this.tenantConnectionManager.getRepository(Attendance);
  }

  async upsert(dto: CreateAttendanceDto, createdBy?: string): Promise<Attendance> {
    const repo = await this.getRepo();

    let record = await repo.findOne({
      where: { employeeId: dto.employeeId, attendanceDate: new Date(dto.attendanceDate) as any },
    });

    if (!record) {
      record = repo.create({ ...dto, createdBy });
    } else {
      Object.assign(record, dto);
    }

    // Auto-compute work hours if both times provided
    if (dto.checkInTime && dto.checkOutTime) {
      const [inH, inM] = dto.checkInTime.split(':').map(Number);
      const [outH, outM] = dto.checkOutTime.split(':').map(Number);
      const totalMins = (outH * 60 + outM) - (inH * 60 + inM);
      record.workHours = totalMins > 0 ? Math.round((totalMins / 60) * 100) / 100 : 0;
    }

    if (!record.status) record.status = AttendanceStatus.PRESENT;
    return repo.save(record);
  }

  async findAll(params: {
    employeeId?: string;
    from?: string;
    to?: string;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Attendance[]; total: number }> {
    const { employeeId, from, to, status, page = 1, limit = 50 } = params;
    const repo = await this.getRepo();
    const qb = repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.employee', 'emp');

    if (employeeId) qb.andWhere('a.employeeId = :employeeId', { employeeId });
    if (from) qb.andWhere('a.attendanceDate >= :from', { from });
    if (to) qb.andWhere('a.attendanceDate <= :to', { to });
    if (status) qb.andWhere('a.status = :status', { status });

    const total = await qb.getCount();
    const data = await qb
      .orderBy('a.attendanceDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<Attendance> {
    const repo = await this.getRepo();
    const item = await repo.findOne({ where: { id }, relations: ['employee'] });
    if (!item) throw new NotFoundException(`Attendance record ${id} not found`);
    return item;
  }

  async update(id: string, dto: Partial<CreateAttendanceDto>): Promise<Attendance> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    if (dto.checkInTime && dto.checkOutTime) {
      const [inH, inM] = dto.checkInTime.split(':').map(Number);
      const [outH, outM] = dto.checkOutTime.split(':').map(Number);
      const totalMins = (outH * 60 + outM) - (inH * 60 + inM);
      record.workHours = totalMins > 0 ? Math.round((totalMins / 60) * 100) / 100 : 0;
    }
    const repo = await this.getRepo();
    return repo.save(record);
  }

  async getMonthlySummary(employeeId: string, year: number, month: number) {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const [row] = await dataSource.query(
      `SELECT
        COUNT(*) AS totalDays,
        SUM(status = 'PRESENT') AS present,
        SUM(status = 'ABSENT') AS absent,
        SUM(status = 'LATE') AS late,
        SUM(status = 'HALF_DAY') AS halfDay,
        SUM(status = 'LEAVE') AS onLeave,
        SUM(status = 'HOLIDAY') AS holidays,
        COALESCE(SUM(work_hours), 0) AS totalWorkHours,
        COALESCE(SUM(overtime_hours), 0) AS totalOvertimeHours
       FROM hr_attendance
       WHERE employee_id = ? AND YEAR(attendance_date) = ? AND MONTH(attendance_date) = ?`,
      [employeeId, year, month],
    );
    return {
      totalDays: Number(row.totalDays),
      present: Number(row.present),
      absent: Number(row.absent),
      late: Number(row.late),
      halfDay: Number(row.halfDay),
      onLeave: Number(row.onLeave),
      holidays: Number(row.holidays),
      totalWorkHours: Number(row.totalWorkHours),
      totalOvertimeHours: Number(row.totalOvertimeHours),
    };
  }
}
