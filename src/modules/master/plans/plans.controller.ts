import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { Public } from '@common/decorators/public.decorator';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';

@ApiTags('Subscription Plans (Master)')
@Controller('master/plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiBearerAuth()
  @Permissions('master.plans.create')
  @ApiOperation({ summary: 'Create a new subscription plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanResponseDto,
  })
  async create(@Body() createDto: CreatePlanDto) {
    const plan = await this.plansService.create(createDto);
    return new PlanResponseDto(plan);
  }

  @Get()
  @ApiBearerAuth()
  @Permissions('master.plans.read')
  @ApiOperation({ summary: 'Get all plans with pagination' })
  @ApiPaginatedResponse(PlanResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.plansService.findAll(paginationDto);
    return {
      data: result.data.map((p) => new PlanResponseDto(p)),
      meta: result.meta,
    };
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Get all active plans (public)' })
  async findAllActive() {
    const plans = await this.plansService.findAllActive();
    return { data: plans.map((p) => new PlanResponseDto(p)) };
  }

  @Get('compare')
  @Public()
  @ApiOperation({ summary: 'Compare plans' })
  @ApiQuery({ name: 'planIds', type: 'string', isArray: true })
  async comparePlans(@Query('planIds') planIds: string[]) {
    const ids = Array.isArray(planIds) ? planIds : [planIds];
    return this.plansService.comparePlans(ids);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Permissions('master.plans.read')
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Plan found',
    type: PlanResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const plan = await this.plansService.findById(id);
    return new PlanResponseDto(plan);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Permissions('master.plans.update')
  @ApiOperation({ summary: 'Update plan' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePlanDto,
  ) {
    const plan = await this.plansService.update(id, updateDto);
    return new PlanResponseDto(plan);
  }

  @Post(':id/features')
  @ApiBearerAuth()
  @Permissions('master.plans.update')
  @ApiOperation({ summary: 'Add feature to plan' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addFeature(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    featureDto: {
      featureCode: string;
      featureName: string;
      description?: string;
      isEnabled: boolean;
    },
  ) {
    const feature = await this.plansService.addFeature(id, featureDto);
    return feature;
  }

  @Patch('features/:featureId')
  @ApiBearerAuth()
  @Permissions('master.plans.update')
  @ApiOperation({ summary: 'Update feature' })
  @ApiParam({ name: 'featureId', type: 'string', format: 'uuid' })
  async updateFeature(
    @Param('featureId', ParseUUIDPipe) featureId: string,
    @Body('isEnabled') isEnabled: boolean,
  ) {
    const feature = await this.plansService.updateFeature(featureId, isEnabled);
    return feature;
  }

  @Delete('features/:featureId')
  @ApiBearerAuth()
  @Permissions('master.plans.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove feature from plan' })
  @ApiParam({ name: 'featureId', type: 'string', format: 'uuid' })
  async removeFeature(@Param('featureId', ParseUUIDPipe) featureId: string) {
    await this.plansService.removeFeature(featureId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Permissions('master.plans.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete plan' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.plansService.remove(id);
  }
}
