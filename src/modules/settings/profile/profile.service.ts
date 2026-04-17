import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '@entities/master/tenant.entity';
import { UpdateProfileDto, UpdatePreferencesDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Tenant, 'master')
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async getProfile(tenantId: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');
    return tenant;
  }

  async updateProfile(tenantId: string, dto: UpdateProfileDto): Promise<Tenant> {
    const tenant = await this.getProfile(tenantId);
    Object.assign(tenant, dto);
    return this.tenantRepo.save(tenant);
  }

  async updatePreferences(tenantId: string, dto: UpdatePreferencesDto): Promise<Tenant> {
    const tenant = await this.getProfile(tenantId);
    Object.assign(tenant, dto);
    return this.tenantRepo.save(tenant);
  }

  async updateLogo(tenantId: string, logoUrl: string): Promise<Tenant> {
    const tenant = await this.getProfile(tenantId);
    tenant.logoUrl = logoUrl;
    return this.tenantRepo.save(tenant);
  }
}
