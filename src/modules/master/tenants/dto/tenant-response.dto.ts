import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tenant } from '@entities/master/tenant.entity';
import { SubscriptionStatus, TenantStatus } from '@common/enums';

class TenantDatabaseDto {
  @ApiProperty()
  databaseName: string;

  @ApiProperty()
  isProvisioned: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  provisionedAt: Date;

  @ApiProperty()
  host: string;

  @ApiProperty()
  port: number;
}

class SubscriptionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  planName?: string;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  trialEndDate?: Date;

  @ApiPropertyOptional()
  currentPeriodEnd?: Date;
}

export class TenantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantCode: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  addressLine1?: string;

  @ApiPropertyOptional()
  addressLine2?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  taxId?: string;

  @ApiPropertyOptional()
  industry?: string;

  @ApiPropertyOptional()
  employeeCount?: number;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  dateFormat: string;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  logoUrl?: string;

  @ApiProperty({ enum: TenantStatus })
  status: TenantStatus;

  @ApiPropertyOptional()
  activatedAt?: Date;

  @ApiPropertyOptional()
  suspendedAt?: Date;

  @ApiPropertyOptional()
  suspensionReason?: string;

  @ApiPropertyOptional({ type: TenantDatabaseDto })
  database?: TenantDatabaseDto;

  @ApiPropertyOptional({ type: SubscriptionDto })
  subscription?: SubscriptionDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userCount: number;

  constructor(tenant: Tenant) {
    this.id = tenant.id;
    this.tenantCode = tenant.tenantCode;
    this.companyName = tenant.companyName;
    this.displayName = tenant.legalName || tenant.companyName;
    this.email = tenant.email;
    this.phone = tenant.phone;
    this.website = tenant.website;
    this.addressLine1 = tenant.addressLine1;
    this.addressLine2 = tenant.addressLine2;
    this.city = tenant.city;
    this.state = tenant.state;
    this.country = tenant.country;
    this.postalCode = tenant.postalCode;
    this.taxId = tenant.taxId;
    this.industry = tenant.industry;
    this.employeeCount = tenant.employeeCount;
    this.timezone = tenant.timezone;
    this.dateFormat = tenant.dateFormat;
    this.currency = tenant.defaultCurrency;
    this.logoUrl = tenant.logoUrl;
    this.status = tenant.status;
    this.activatedAt = tenant.activatedAt;
    this.suspendedAt = tenant.suspendedAt;
    this.suspensionReason = tenant.suspendedReason;
    this.createdAt = tenant.createdAt;
    this.updatedAt = tenant.updatedAt;
    this.userCount = tenant.users?.length || 0;
    // Database info from columns (not a relation)
    if (tenant.database) {
      this.database = {
        databaseName: tenant.database.databaseName,
        host: tenant.database.host,
        port: tenant.database.port,
        isProvisioned: tenant.database.isProvisioned,
        isActive: tenant.database.isActive,
        provisionedAt: tenant.database.provisionedAt,
      };
    }

    // Get active subscription (first one or most recent)
    const activeSubscription =
      tenant.subscriptions?.find(
        (sub) =>
          sub.status === SubscriptionStatus.ACTIVE ||
          sub.status === SubscriptionStatus.TRIAL,
      ) || tenant.subscriptions?.[0];

    if (activeSubscription) {
      this.subscription = {
        id: activeSubscription.id,
        status: activeSubscription.status,
        planName: activeSubscription.plan?.planName,
        startDate: activeSubscription.currentPeriodStart,
        trialEndDate: activeSubscription.trialEndDate,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
      };
    }
  }
}
