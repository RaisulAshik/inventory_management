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
  CreateBudgetDto,
  QueryBudgetDto,
  UpdateBudgetDto,
  CreateBudgetLineDto,
  UpdateBudgetLineDto,
  ApproveBudgetDto,
} from '../dto/budgets.dto';
import { BudgetsService } from '../service/budgets.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('accounting/budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @Permissions('accounting.budgets.create')
  create(@Body() dto: CreateBudgetDto, @CurrentUser() currentUser: JwtPayload) {
    return this.budgetsService.create(dto, currentUser.sub);
  }

  @Get()
  @Permissions('accounting.budgets.read')
  findAll(@Query() query: QueryBudgetDto) {
    return this.budgetsService.findAll(query);
  }

  @Get(':id')
  @Permissions('accounting.budgets.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetsService.findOne(id);
  }

  @Get(':id/vs-actual')
  @Permissions('accounting.budgets.read')
  getBudgetVsActual(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetsService.getBudgetVsActual(id);
  }

  @Put(':id')
  @Permissions('accounting.budgets.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBudgetDto) {
    return this.budgetsService.update(id, dto);
  }

  // Budget Lines
  @Post(':id/lines')
  @Permissions('accounting.budgets.update')
  addLine(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateBudgetLineDto,
  ) {
    return this.budgetsService.addLine(id, dto);
  }

  @Put('lines/:lineId')
  @Permissions('accounting.budgets.update')
  updateLine(
    @Param('lineId', ParseUUIDPipe) lineId: string,
    @Body() dto: UpdateBudgetLineDto,
  ) {
    return this.budgetsService.updateLine(lineId, dto);
  }

  @Delete('lines/:lineId')
  @Permissions('accounting.budgets.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLine(@Param('lineId', ParseUUIDPipe) lineId: string) {
    return this.budgetsService.removeLine(lineId);
  }

  // Workflow
  @Post(':id/submit')
  @Permissions('accounting.budgets.submit')
  submit(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetsService.submitForApproval(id);
  }

  @Post(':id/approve')
  @Permissions('accounting.budgets.approve')
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveBudgetDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.budgetsService.approve(id, dto, currentUser.sub);
  }

  @Post(':id/reject')
  @Permissions('accounting.budgets.approve')
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveBudgetDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.budgetsService.reject(id, dto, currentUser.sub);
  }

  @Post(':id/activate')
  @Permissions('accounting.budgets.activate')
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetsService.activate(id);
  }

  @Post(':id/close')
  @Permissions('accounting.budgets.close')
  close(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetsService.close(id);
  }

  @Delete(':id')
  @Permissions('accounting.budgets.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetsService.remove(id);
  }
}
