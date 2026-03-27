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
} from '@nestjs/swagger';
import { AdjustmentsService } from './adjustments.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { AdjustmentFilterDto } from './dto/adjustment-filter.dto';
import { AdjustmentResponseDto } from './dto/adjustment-response.dto';
import { CreateAdjustmentItemDto } from './dto/create-adjustment-item.dto';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { UpdateAdjustmentDto } from './dto/update-adjustment.dto';

@ApiTags('Stock Adjustments')
@ApiBearerAuth()
@Controller('adjustments')
export class AdjustmentsController {
  constructor(private readonly adjustmentsService: AdjustmentsService) {}

  @Post()
  @Permissions('adjustments.create')
  @ApiOperation({ summary: 'Create a new stock adjustment' })
  @ApiResponse({
    status: 201,
    description: 'Adjustment created successfully',
    type: AdjustmentResponseDto,
  })
  async create(
    @Body() createAdjustmentDto: CreateAdjustmentDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const adjustment = await this.adjustmentsService.create(
      createAdjustmentDto,
      currentUser.sub,
    );
    return new AdjustmentResponseDto(adjustment);
  }

  @Get()
  @Permissions('adjustments.read')
  @ApiOperation({ summary: 'Get all adjustments with filters and pagination' })
  @ApiPaginatedResponse(AdjustmentResponseDto)
  async findAll(
    @Query() filterDto: AdjustmentFilterDto,
  ) {
    const result = await this.adjustmentsService.findAll(filterDto);
    return {
      data: result.data.map((a) => new AdjustmentResponseDto(a)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @Permissions('adjustments.read')
  @ApiOperation({ summary: 'Get adjustment by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Adjustment found',
    type: AdjustmentResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const adjustment = await this.adjustmentsService.findById(id);
    return new AdjustmentResponseDto(adjustment);
  }

  @Patch(':id')
  @Permissions('adjustments.update')
  @ApiOperation({ summary: 'Update adjustment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdjustmentDto: UpdateAdjustmentDto,
  ) {
    const adjustment = await this.adjustmentsService.update(
      id,
      updateAdjustmentDto,
    );
    return new AdjustmentResponseDto(adjustment);
  }

  @Post(':id/submit')
  @Permissions('adjustments.update')
  @ApiOperation({ summary: 'Submit adjustment for approval' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async submitForApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const adjustment = await this.adjustmentsService.submitForApproval(
      id,
      currentUser.sub,
    );
    return new AdjustmentResponseDto(adjustment);
  }

  @Post(':id/approve')
  @Permissions('adjustments.approve')
  @ApiOperation({ summary: 'Approve adjustment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const adjustment = await this.adjustmentsService.approve(
      id,
      currentUser.sub,
    );
    return new AdjustmentResponseDto(adjustment);
  }

  @Post(':id/reject')
  @Permissions('adjustments.approve')
  @ApiOperation({ summary: 'Reject adjustment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const adjustment = await this.adjustmentsService.reject(
      id,
      currentUser.sub,
      reason,
    );
    return new AdjustmentResponseDto(adjustment);
  }

  @Post(':id/cancel')
  @Permissions('adjustments.update')
  @ApiOperation({ summary: 'Cancel adjustment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const adjustment = await this.adjustmentsService.cancel(
      id,
      currentUser.sub,
      reason,
    );
    return new AdjustmentResponseDto(adjustment);
  }

  @Delete(':id')
  @Permissions('adjustments.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete adjustment (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.adjustmentsService.remove(id);
  }

  // Item endpoints
  @Post(':id/items')
  @Permissions('adjustments.update')
  @ApiOperation({ summary: 'Add item to adjustment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: CreateAdjustmentItemDto,
  ) {
    const item = await this.adjustmentsService.addItem(id, itemDto);
    return item;
  }

  @Patch('items/:itemId')
  @Permissions('adjustments.update')
  @ApiOperation({ summary: 'Update adjustment item' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() itemDto: Partial<CreateAdjustmentItemDto>,
  ) {
    const item = await this.adjustmentsService.updateItem(itemId, itemDto);
    return item;
  }

  @Delete('items/:itemId')
  @Permissions('adjustments.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove adjustment item' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async removeItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    await this.adjustmentsService.removeItem(itemId);
  }
}
