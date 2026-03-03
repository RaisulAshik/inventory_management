import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  //ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SystemSettingsService } from './system-settings.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { Public } from '@common/decorators/public.decorator';

@ApiTags('System Settings (Master)')
@Controller('master/settings')
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  @Get()
  @ApiBearerAuth()
  @Permissions('master.settings.read')
  @ApiOperation({ summary: 'Get all settings' })
  @ApiQuery({ name: 'category', required: false })
  async findAll(@Query('category') category?: string) {
    const settings = await this.settingsService.findAll(category);
    return { data: settings };
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get public settings' })
  async findPublic() {
    const settings = await this.settingsService.findPublic();
    return { data: settings };
  }

  @Get('grouped')
  @ApiBearerAuth()
  @Permissions('master.settings.read')
  @ApiOperation({ summary: 'Get settings grouped by category' })
  async findGrouped() {
    const grouped = await this.settingsService.findGroupedByCategory();
    return { data: grouped };
  }

  @Get(':key')
  @ApiBearerAuth()
  @Permissions('master.settings.read')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiParam({ name: 'key', type: 'string' })
  async findByKey(@Param('key') key: string) {
    const setting = await this.settingsService.findByKey(key);
    return { data: setting };
  }

  @Post()
  @ApiBearerAuth()
  @Permissions('master.settings.update')
  @ApiOperation({ summary: 'Set setting value' })
  async setValue(
    @Body()
    body: {
      key: string;
      value: any;
      valueType?: string;
      category?: string;
      description?: string;
      isPublic?: boolean;
    },
  ) {
    const setting = await this.settingsService.setValue(body.key, body.value, {
      valueType: body.valueType,
      category: body.category,
      description: body.description,
      isPublic: body.isPublic,
    });
    return setting;
  }

  @Post('bulk')
  @ApiBearerAuth()
  @Permissions('master.settings.update')
  @ApiOperation({ summary: 'Bulk update settings' })
  async bulkUpdate(@Body() body: { settings: { key: string; value: any }[] }) {
    const settings = await this.settingsService.bulkUpdate(body.settings);
    return { data: settings };
  }

  @Delete(':key')
  @ApiBearerAuth()
  @Permissions('master.settings.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete setting' })
  @ApiParam({ name: 'key', type: 'string' })
  async remove(@Param('key') key: string) {
    await this.settingsService.remove(key);
  }
}
