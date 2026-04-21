import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';

import { DepartmentsController } from './departments/departments.controller';
import { DepartmentsService } from './departments/departments.service';

import { DesignationsController } from './designations/designations.controller';
import { DesignationsService } from './designations/designations.service';

import { EmployeesController } from './employees/employees.controller';
import { EmployeesService } from './employees/employees.service';

import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';

import { LeaveTypesController } from './leaves/leave-types.controller';
import { LeaveTypesService } from './leaves/leave-types.service';

import { LeaveRequestsController } from './leaves/leave-requests.controller';
import { LeaveRequestsService } from './leaves/leave-requests.service';

import { PayrollController } from './payroll/payroll.controller';
import { PayrollService } from './payroll/payroll.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    DepartmentsController,
    DesignationsController,
    EmployeesController,
    AttendanceController,
    LeaveTypesController,
    LeaveRequestsController,
    PayrollController,
  ],
  providers: [
    DepartmentsService,
    DesignationsService,
    EmployeesService,
    AttendanceService,
    LeaveTypesService,
    LeaveRequestsService,
    PayrollService,
  ],
  exports: [
    EmployeesService,
    AttendanceService,
    LeaveRequestsService,
    PayrollService,
  ],
})
export class HrModule {}
