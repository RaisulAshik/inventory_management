import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the HR tables that only the provisioning service knew how to build.
 *
 * Migration 013 creates `hr_employees`, but the other HR tables were only
 * ever created by TenantProvisioningService when a tenant was first set up.
 * A tenant provisioned before the HR module existed therefore ends up with
 * `hr_employees` and nothing else, and every HR endpoint still fails —
 * including GET /hr/employees, because the Employee entity joins
 * `hr_departments` and `hr_designations`.
 *
 * The DDL below is copied verbatim from TenantProvisioningService so the two
 * paths produce identical schemas. Every statement is CREATE TABLE IF NOT
 * EXISTS, so this is safe to run against a tenant that already has some or
 * all of these tables.
 *
 * Tables: hr_employees, hr_departments, hr_designations, hr_attendance, hr_leave_types, hr_leave_requests, hr_payrolls, hr_payroll_components
 */
export class CreateMissingHrTables1700000000014 implements MigrationInterface {
  name = 'CreateMissingHrTables1700000000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_employees\` (
          \`id\`                      CHAR(36)      NOT NULL,
          \`employee_code\`           VARCHAR(50)   NOT NULL,
          \`first_name\`              VARCHAR(100)  NOT NULL,
          \`last_name\`               VARCHAR(100)  NULL,
          \`email\`                   VARCHAR(255)  NULL,
          \`phone\`                   VARCHAR(50)   NULL,

          \`date_of_birth\`           DATE          NULL,
          \`gender\`                  ENUM('MALE','FEMALE','OTHER') NULL,
          \`marital_status\`          ENUM('SINGLE','MARRIED','DIVORCED','WIDOWED') NULL,
          \`national_id\`             VARCHAR(100)  NULL,
          \`address_line1\`           VARCHAR(255)  NULL,
          \`address_line2\`           VARCHAR(255)  NULL,
          \`city\`                    VARCHAR(100)  NULL,
          \`state\`                   VARCHAR(100)  NULL,
          \`country\`                 VARCHAR(100)  NULL,
          \`postal_code\`             VARCHAR(20)   NULL,
          \`emergency_contact_name\`  VARCHAR(100)  NULL,
          \`emergency_contact_phone\` VARCHAR(50)   NULL,
          \`department_id\`           CHAR(36)      NULL,
          \`designation_id\`          CHAR(36)      NULL,
          \`reporting_to\`            CHAR(36)      NULL,
          \`hire_date\`               DATE          NOT NULL,
          \`confirmation_date\`       DATE          NULL,
          \`resign_date\`             DATE          NULL,
          \`termination_date\`        DATE          NULL,
          \`employment_type\`         ENUM('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
          \`employment_status\`       ENUM('ACTIVE','INACTIVE','PROBATION','ON_LEAVE','TERMINATED','RESIGNED') NOT NULL DEFAULT 'PROBATION',
          \`salary_basis\`            ENUM('MONTHLY','DAILY','HOURLY') NOT NULL DEFAULT 'MONTHLY',
          \`basic_salary\`            DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`bank_name\`               VARCHAR(200)  NULL,
          \`bank_account_number\`     VARCHAR(100)  NULL,
          \`bank_branch\`             VARCHAR(200)  NULL,
          \`profile_photo_url\`       VARCHAR(500)  NULL,
          \`notes\`                   TEXT          NULL,
          \`is_active\`               TINYINT(1)    NOT NULL DEFAULT 1,
          \`created_by\`              CHAR(36)      NULL,
          \`created_at\`              DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`              DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`              DATETIME(6)   NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_emp_code\`  (\`employee_code\`),
          UNIQUE KEY \`uk_emp_email\` (\`email\`),
          INDEX \`idx_emp_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_departments\` (
          \`id\`              CHAR(36)      NOT NULL,
          \`department_code\` VARCHAR(30)   NOT NULL,
          \`name\`            VARCHAR(100)  NOT NULL,
          \`description\`     TEXT          NULL,
          \`parent_id\`       CHAR(36)      NULL,
          \`manager_id\`      CHAR(36)      NULL,
          \`is_active\`       TINYINT(1)    NOT NULL DEFAULT 1,
          \`created_by\`      CHAR(36)      NULL,
          \`created_at\`      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`      DATETIME(6)   NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_dept_code\` (\`department_code\`),
          CONSTRAINT \`fk_dept_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`hr_departments\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_designations\` (
          \`id\`               CHAR(36)     NOT NULL,
          \`designation_code\` VARCHAR(30)  NOT NULL,
          \`name\`             VARCHAR(100) NOT NULL,
          \`department_id\`    CHAR(36)     NULL,
          \`description\`      TEXT         NULL,
          \`is_active\`        TINYINT(1)   NOT NULL DEFAULT 1,
          \`created_by\`       CHAR(36)     NULL,
          \`created_at\`       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`       DATETIME(6)  NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_desig_code\` (\`designation_code\`),
          CONSTRAINT \`fk_desig_dept\` FOREIGN KEY (\`department_id\`) REFERENCES \`hr_departments\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_attendance\` (
          \`id\`              CHAR(36)     NOT NULL,
          \`employee_id\`     CHAR(36)     NOT NULL,
          \`attendance_date\` DATE         NOT NULL,
          \`status\`          ENUM('PRESENT','ABSENT','HALF_DAY','LATE','ON_LEAVE','HOLIDAY') NOT NULL DEFAULT 'PRESENT',
          \`check_in_time\`   TIME         NULL,
          \`check_out_time\`  TIME         NULL,
          \`work_hours\`      DECIMAL(4,2) NULL,
          \`overtime_hours\`  DECIMAL(4,2) NOT NULL DEFAULT 0,
          \`notes\`           TEXT         NULL,
          \`created_at\`      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uq_att_emp_date\` (\`employee_id\`, \`attendance_date\`),
          CONSTRAINT \`fk_att_emp\` FOREIGN KEY (\`employee_id\`) REFERENCES \`hr_employees\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_leave_types\` (
          \`id\`                     CHAR(36)    NOT NULL,
          \`name\`                   VARCHAR(100) NOT NULL,
          \`code\`                   VARCHAR(20)  NOT NULL,
          \`days_allowed\`           INT          NOT NULL DEFAULT 0,
          \`is_carry_forward\`       TINYINT(1)   NOT NULL DEFAULT 0,
          \`max_carry_forward_days\` INT          NOT NULL DEFAULT 0,
          \`is_paid\`                TINYINT(1)   NOT NULL DEFAULT 1,
          \`description\`            TEXT         NULL,
          \`is_active\`              TINYINT(1)   NOT NULL DEFAULT 1,
          \`created_by\`             CHAR(36)     NULL,
          \`created_at\`             DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`             DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`             DATETIME(6)  NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_leave_type_code\` (\`code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_leave_requests\` (
          \`id\`               CHAR(36)      NOT NULL,
          \`request_code\`     VARCHAR(30)   NOT NULL,
          \`employee_id\`      CHAR(36)      NOT NULL,
          \`leave_type_id\`    CHAR(36)      NOT NULL,
          \`start_date\`       DATE          NOT NULL,
          \`end_date\`         DATE          NOT NULL,
          \`total_days\`       DECIMAL(4,1)  NOT NULL,
          \`reason\`           TEXT          NULL,
          \`status\`           ENUM('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
          \`approved_by\`      CHAR(36)      NULL,
          \`approved_at\`      DATETIME(6)   NULL,
          \`rejection_reason\` TEXT          NULL,
          \`created_by\`       CHAR(36)      NULL,
          \`created_at\`       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`       DATETIME(6)   NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_lr_code\` (\`request_code\`),
          CONSTRAINT \`fk_lr_emp\`   FOREIGN KEY (\`employee_id\`)   REFERENCES \`hr_employees\`   (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_lr_ltype\` FOREIGN KEY (\`leave_type_id\`) REFERENCES \`hr_leave_types\` (\`id\`) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_payrolls\` (
          \`id\`               CHAR(36)      NOT NULL,
          \`payroll_code\`     VARCHAR(30)   NOT NULL,
          \`employee_id\`      CHAR(36)      NOT NULL,
          \`payroll_month\`    TINYINT       NOT NULL,
          \`payroll_year\`     SMALLINT      NOT NULL,
          \`basic_salary\`     DECIMAL(15,2) NOT NULL DEFAULT 0,
          \`total_earnings\`   DECIMAL(15,2) NOT NULL DEFAULT 0,
          \`total_deductions\` DECIMAL(15,2) NOT NULL DEFAULT 0,
          \`net_salary\`       DECIMAL(15,2) NOT NULL DEFAULT 0,
          \`status\`           ENUM('DRAFT','APPROVED','PAID') NOT NULL DEFAULT 'DRAFT',
          \`payment_date\`     DATE          NULL,
          \`approved_by\`      CHAR(36)      NULL,
          \`approved_at\`      DATETIME(6)   NULL,
          \`notes\`            TEXT          NULL,
          \`created_by\`       CHAR(36)      NULL,
          \`created_at\`       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`       DATETIME(6)   NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_payroll_code\` (\`payroll_code\`),
          UNIQUE KEY \`uq_payroll_emp_month\` (\`employee_id\`, \`payroll_month\`, \`payroll_year\`),
          CONSTRAINT \`fk_pay_emp\` FOREIGN KEY (\`employee_id\`) REFERENCES \`hr_employees\` (\`id\`) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`hr_payroll_components\` (
          \`id\`         CHAR(36)      NOT NULL,
          \`payroll_id\` CHAR(36)      NOT NULL,
          \`name\`       VARCHAR(100)  NOT NULL,
          \`type\`       ENUM('EARNING','DEDUCTION') NOT NULL,
          \`amount\`     DECIMAL(15,2) NOT NULL DEFAULT 0,
          \`notes\`      TEXT          NULL,
          \`created_at\` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          CONSTRAINT \`fk_pc_payroll\` FOREIGN KEY (\`payroll_id\`) REFERENCES \`hr_payrolls\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropped in reverse dependency order. `hr_employees` is left alone:
    // migration 013 owns it.
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_payroll_components\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_payrolls\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_leave_requests\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_leave_types\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_attendance\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_designations\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`hr_departments\``);
  }
}
