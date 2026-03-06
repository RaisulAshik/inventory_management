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
  CreateBankReconciliationDto,
  QueryBankReconciliationDto,
  UpdateBankReconciliationDto,
  CompleteReconciliationDto,
} from '../dto/bank-reconciliation.dto';
import { BankReconciliationsService } from '../service/bank-reconciliation.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('accounting/bank-reconciliations')
export class BankReconciliationsController {
  constructor(
    private readonly reconciliationsService: BankReconciliationsService,
  ) {}

  @Post()
  @Permissions('accounting.bank-reconciliations.create')
  create(
    @Body() dto: CreateBankReconciliationDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.reconciliationsService.create(dto, currentUser.sub);
  }

  @Get()
  @Permissions('accounting.bank-reconciliations.read')
  findAll(@Query() query: QueryBankReconciliationDto) {
    return this.reconciliationsService.findAll(query);
  }

  @Get(':id')
  @Permissions('accounting.bank-reconciliations.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reconciliationsService.findOne(id);
  }

  @Get(':id/summary')
  @Permissions('accounting.bank-reconciliations.read')
  getSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.reconciliationsService.getReconciliationSummary(id);
  }

  @Put(':id')
  @Permissions('accounting.bank-reconciliations.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBankReconciliationDto,
  ) {
    return this.reconciliationsService.update(id, dto);
  }

  @Post(':id/start')
  @Permissions('accounting.bank-reconciliations.update')
  start(@Param('id', ParseUUIDPipe) id: string) {
    return this.reconciliationsService.startReconciliation(id);
  }

  @Post(':id/complete')
  @Permissions('accounting.bank-reconciliations.complete')
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteReconciliationDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.reconciliationsService.complete(id, dto, currentUser.sub);
  }

  @Post(':id/cancel')
  @Permissions('accounting.bank-reconciliations.update')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.reconciliationsService.cancel(id);
  }
}
