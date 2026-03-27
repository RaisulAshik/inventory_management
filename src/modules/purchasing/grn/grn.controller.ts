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
import { GrnService } from './grn.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreateGrnDto } from './dto/create-grn.dto';
import { GrnFilterDto } from './dto/grn-filter.dto';
import { GrnResponseDto } from './dto/grn-response.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';

@ApiTags('Goods Receipt Notes')
@ApiBearerAuth()
@Controller('grn')
export class GrnController {
  constructor(private readonly grnService: GrnService) {}

  @Post()
  @Permissions('grn.create')
  @ApiOperation({ summary: 'Create a new GRN' })
  @ApiResponse({
    status: 201,
    description: 'GRN created successfully',
    type: GrnResponseDto,
  })
  async create(
    @Body() createDto: CreateGrnDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const grn = await this.grnService.create(createDto, currentUser.sub);
    return new GrnResponseDto(grn);
  }

  @Get()
  @Permissions('grn.read')
  @ApiOperation({ summary: 'Get all GRNs with filters and pagination' })
  @ApiPaginatedResponse(GrnResponseDto)
  async findAll(
    @Query() filterDto: GrnFilterDto,
  ) {
    const result = await this.grnService.findAll(filterDto);
    return {
      data: result.data.map((grn) => new GrnResponseDto(grn)),
      meta: result.meta,
    };
  }

  @Get('purchase-order/:poId')
  @Permissions('grn.read')
  @ApiOperation({ summary: 'Get GRNs for a purchase order' })
  @ApiParam({ name: 'poId', type: 'string', format: 'uuid' })
  async getGrnsForPurchaseOrder(@Param('poId', ParseUUIDPipe) poId: string) {
    const grns = await this.grnService.getGrnsForPurchaseOrder(poId);
    return { data: grns.map((grn) => new GrnResponseDto(grn)) };
  }

  @Get(':id')
  @Permissions('grn.read')
  @ApiOperation({ summary: 'Get GRN by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'GRN found',
    type: GrnResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const grn = await this.grnService.findById(id);
    return new GrnResponseDto(grn);
  }

  @Patch(':id')
  @Permissions('grn.update')
  @ApiOperation({ summary: 'Update GRN (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateGrnDto,
  ) {
    const grn = await this.grnService.update(id, updateDto);
    return new GrnResponseDto(grn);
  }

  @Post(':id/submit')
  @Permissions('grn.update')
  @ApiOperation({ summary: 'Submit GRN for QC/approval' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async submitForApproval(@Param('id', ParseUUIDPipe) id: string) {
    const grn = await this.grnService.submitForApproval(id);
    return new GrnResponseDto(grn);
  }

  @Post(':id/complete-qc')
  @Permissions('grn.qc')
  @ApiOperation({ summary: 'Complete quality check' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async completeQc(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const grn = await this.grnService.completeQc(id, currentUser.sub);
    return new GrnResponseDto(grn);
  }

  @Post(':id/approve')
  @Permissions('grn.approve')
  @ApiOperation({ summary: 'Approve GRN and update stock' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const grn = await this.grnService.approve(id, currentUser.sub);
    return new GrnResponseDto(grn);
  }

  @Post(':id/cancel')
  @Permissions('grn.update')
  @ApiOperation({ summary: 'Cancel GRN' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const grn = await this.grnService.cancel(id, currentUser.sub, reason);
    return new GrnResponseDto(grn);
  }

  @Delete(':id')
  @Permissions('grn.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete GRN (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.grnService.remove(id);
  }
}
