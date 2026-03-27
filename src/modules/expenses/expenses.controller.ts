import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseFilterDto } from './dto/expense-filter.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Permissions('expenses.create')
  @ApiOperation({
    summary: 'Record an expense',
    description:
      'Creates the expense and automatically posts a journal entry (DR Expense / CR Paid-From account).',
  })
  async create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.expensesService.create(dto, user.sub);
  }

  @Get()
  @Permissions('expenses.read')
  @ApiOperation({ summary: 'List expenses with filters and pagination' })
  async findAll(@Query() filterDto: ExpenseFilterDto) {
    return this.expensesService.findAll(filterDto);
  }

  @Get('summary')
  @Permissions('expenses.read')
  @ApiOperation({ summary: 'Expense summary grouped by account' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'toDate', required: false, description: 'YYYY-MM-DD' })
  async getSummary(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const data = await this.expensesService.getSummary(fromDate, toDate);
    return { data };
  }

  @Get(':id')
  @Permissions('expenses.read')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id/cancel')
  @Permissions('expenses.update')
  @ApiOperation({
    summary: 'Cancel an expense',
    description:
      'Marks the expense as CANCELLED. To reverse the accounting entry, manually reverse the linked journal entry.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.cancel(id);
  }
}
