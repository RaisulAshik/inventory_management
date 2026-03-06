import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import {
  CreateFiscalYearDto,
  QueryFiscalYearDto,
  UpdateFiscalYearDto,
  CloseFiscalYearDto,
} from '../dto/fiscal-years.dto';
import { FiscalYearsService } from '../service/fiscal-years.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('accounting/fiscal-years')
export class FiscalYearsController {
  constructor(private readonly fiscalYearsService: FiscalYearsService) {}

  @Post()
  @Permissions('accounting.fiscal-years.create')
  create(@Body() dto: CreateFiscalYearDto) {
    return this.fiscalYearsService.create(dto);
  }

  @Get()
  @Permissions('accounting.fiscal-years.read')
  findAll(@Query() query: QueryFiscalYearDto) {
    return this.fiscalYearsService.findAll(query);
  }

  @Get('current')
  @Permissions('accounting.fiscal-years.read')
  findCurrent() {
    return this.fiscalYearsService.findCurrent();
  }

  @Get(':id')
  @Permissions('accounting.fiscal-years.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fiscalYearsService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.fiscal-years.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFiscalYearDto,
  ) {
    return this.fiscalYearsService.update(id, dto);
  }

  @Post(':id/close')
  @Permissions('accounting.fiscal-years.close')
  close(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CloseFiscalYearDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.fiscalYearsService.close(id, dto, currentUser.sub);
  }

  @Delete(':id')
  @Permissions('accounting.fiscal-years.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fiscalYearsService.remove(id);
  }
}
