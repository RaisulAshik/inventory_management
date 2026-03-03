import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import {
  ChangePlanDto,
  UpdateSubscriptionDto,
} from './dto/update-subscription.dto';

@ApiTags('Subscriptions (Master)')
@ApiBearerAuth()
@Controller('master/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Permissions('master.subscriptions.create')
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto,
  })
  async create(@Body() createDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionsService.create(createDto);
    return new SubscriptionResponseDto(subscription);
  }

  @Get()
  @Permissions('master.subscriptions.read')
  @ApiOperation({ summary: 'Get all subscriptions with pagination' })
  @ApiPaginatedResponse(SubscriptionResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.subscriptionsService.findAll(paginationDto);
    return {
      data: result.data.map((s) => new SubscriptionResponseDto(s)),
      meta: result.meta,
    };
  }

  @Get('tenant/:tenantId')
  @Permissions('master.subscriptions.read')
  @ApiOperation({ summary: 'Get subscription by tenant ID' })
  @ApiParam({ name: 'tenantId', type: 'string', format: 'uuid' })
  async findByTenantId(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    const subscription =
      await this.subscriptionsService.findByTenantId(tenantId);
    return {
      data: subscription ? new SubscriptionResponseDto(subscription) : null,
    };
  }

  @Get('tenant/:tenantId/billing')
  @Permissions('master.subscriptions.read')
  @ApiOperation({ summary: 'Get billing history for a tenant' })
  @ApiParam({ name: 'tenantId', type: 'string', format: 'uuid' })
  async getBillingHistory(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    const history = await this.subscriptionsService.getBillingHistory(tenantId);
    return { data: history };
  }

  @Get(':id')
  @Permissions('master.subscriptions.read')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Subscription found',
    type: SubscriptionResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const subscription = await this.subscriptionsService.findById(id);
    return new SubscriptionResponseDto(subscription);
  }

  @Patch(':id')
  @Permissions('master.subscriptions.update')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.subscriptionsService.update(id, updateDto);
    return new SubscriptionResponseDto(subscription);
  }

  @Patch(':id/change-plan')
  async changePlan(
    @Param('id') id: string,
    @Body() dto: ChangePlanDto,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionsService.changePlan(
      id,
      dto.newPlanId,
      dto.billingCycle,
    );
    return new SubscriptionResponseDto(subscription);
  }

  @Post(':id/cancel')
  @Permissions('master.subscriptions.update')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('cancelImmediately') cancelImmediately: boolean = false,
  ) {
    const subscription = await this.subscriptionsService.cancel(
      id,
      cancelImmediately,
    );
    return new SubscriptionResponseDto(subscription);
  }

  @Post(':id/reactivate')
  @Permissions('master.subscriptions.update')
  @ApiOperation({ summary: 'Reactivate subscription' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reactivate(@Param('id', ParseUUIDPipe) id: string) {
    const subscription = await this.subscriptionsService.reactivate(id);
    return new SubscriptionResponseDto(subscription);
  }

  @Post(':id/renew')
  @Permissions('master.subscriptions.update')
  @ApiOperation({ summary: 'Renew subscription' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async renew(@Param('id', ParseUUIDPipe) id: string) {
    const subscription = await this.subscriptionsService.renew(id);
    return new SubscriptionResponseDto(subscription);
  }
}
