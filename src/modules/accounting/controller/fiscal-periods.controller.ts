import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import {
  CreateFiscalPeriodDto,
  QueryFiscalPeriodDto,
  UpdateFiscalPeriodDto,
} from '../dto/fiscal-periods.dto';
import { FiscalPeriodsService } from '../service/fiscal-periods.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('accounting/fiscal-periods')
export class FiscalPeriodsController {
  constructor(private readonly fiscalPeriodsService: FiscalPeriodsService) {}

  @Post()
  @Permissions('accounting.fiscal-periods.create')
  create(@Body() dto: CreateFiscalPeriodDto) {
    return this.fiscalPeriodsService.create(dto);
  }

  @Get()
  @Permissions('accounting.fiscal-periods.read')
  findAll(@Query() query: QueryFiscalPeriodDto) {
    return this.fiscalPeriodsService.findAll(query);
  }

  @Get(':id')
  @Permissions('accounting.fiscal-periods.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fiscalPeriodsService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.fiscal-periods.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFiscalPeriodDto,
  ) {
    return this.fiscalPeriodsService.update(id, dto);
  }

  @Post(':id/close')
  @Permissions('accounting.fiscal-periods.close')
  close(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.fiscalPeriodsService.close(id, currentUser.sub);
  }

  @Post(':id/reopen')
  @Permissions('accounting.fiscal-periods.reopen')
  reopen(@Param('id', ParseUUIDPipe) id: string) {
    return this.fiscalPeriodsService.reopen(id);
  }
}
