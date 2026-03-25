import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpsertSettingDto, BulkUpsertSettingDto } from './dto/update-setting.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { SettingCategory } from '@entities/tenant/user/tenant-setting.entity';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * GET /settings
   * List all tenant settings, optionally filtered by category.
   */
  @Get()
  @Permissions('settings.read')
  @ApiOperation({ summary: 'Get all tenant settings' })
  @ApiQuery({ name: 'category', enum: SettingCategory, required: false })
  async findAll(@Query('category') category?: SettingCategory) {
    const settings = await this.settingsService.findAll(category);
    return { data: settings };
  }

  /**
   * GET /settings/accounting
   * Quick view of all 6 auto-accounting settings and whether they are configured.
   */
  @Get('accounting')
  @Permissions('settings.read')
  @ApiOperation({
    summary: 'Get auto-accounting settings status',
    description:
      'Returns the 6 required accounting account IDs and whether each one is configured.',
  })
  async getAccountingSettings() {
    const settings = await this.settingsService.getAccountingSettings();
    const allConfigured = settings.every((s) => s.configured);
    return { data: settings, allConfigured };
  }

  /**
   * GET /settings/:key
   * Get a single setting by key.
   */
  @Get(':key')
  @Permissions('settings.read')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiParam({ name: 'key', example: 'acc.default_ar_account' })
  async findOne(@Param('key') key: string) {
    const setting = await this.settingsService.findByKey(key);
    return { data: setting };
  }

  /**
   * PUT /settings/:key
   * Create or update a single setting.
   */
  @Put(':key')
  @Permissions('settings.update')
  @ApiOperation({ summary: 'Create or update a setting by key' })
  @ApiParam({ name: 'key', example: 'acc.default_ar_account' })
  @ApiResponse({ status: 200, description: 'Setting saved' })
  async upsert(
    @Param('key') key: string,
    @Body() dto: UpsertSettingDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const setting = await this.settingsService.upsert(key, dto, currentUser.sub);
    return { data: setting };
  }

  /**
   * POST /settings/bulk
   * Create or update multiple settings at once.
   * Most useful for wiring all 6 accounting accounts in one call.
   */
  @Post('bulk')
  @Permissions('settings.update')
  @ApiOperation({
    summary: 'Bulk create or update settings',
    description: 'Pass a key→value map. All keys are upserted in one call.',
  })
  @ApiResponse({ status: 200, description: 'Settings saved' })
  async bulkUpsert(
    @Body() dto: BulkUpsertSettingDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const settings = await this.settingsService.bulkUpsert(dto, currentUser.sub);
    return { data: settings, count: settings.length };
  }

  /**
   * DELETE /settings/:key
   * Remove a non-system setting.
   */
  @Delete(':key')
  @Permissions('settings.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a setting by key (non-system only)' })
  @ApiParam({ name: 'key', example: 'acc.default_vat_account' })
  async remove(@Param('key') key: string) {
    await this.settingsService.remove(key);
  }
}
