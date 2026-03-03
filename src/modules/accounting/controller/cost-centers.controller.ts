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
import {
  CreateCostCenterDto,
  QueryCostCenterDto,
  UpdateCostCenterDto,
} from '../dto/cost-centers.dto';
import { CostCentersService } from '../service/cost-centers.service';

@Controller('api/v1/accounting/cost-centers')
export class CostCentersController {
  constructor(private readonly costCentersService: CostCentersService) {}

  @Post()
  @Permissions('accounting.cost-centers.create')
  create(@Body() dto: CreateCostCenterDto) {
    return this.costCentersService.create(dto);
  }

  @Get()
  @Permissions('accounting.cost-centers.read')
  findAll(@Query() query: QueryCostCenterDto) {
    return this.costCentersService.findAll(query);
  }

  @Get('tree')
  @Permissions('accounting.cost-centers.read')
  getTree() {
    return this.costCentersService.getTree();
  }

  @Get(':id')
  @Permissions('accounting.cost-centers.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.costCentersService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.cost-centers.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCostCenterDto,
  ) {
    return this.costCentersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('accounting.cost-centers.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.costCentersService.remove(id);
  }
}
