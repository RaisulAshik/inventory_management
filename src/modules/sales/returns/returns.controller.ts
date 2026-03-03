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
import { ReturnsService } from './returns.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnFilterDto } from './dto/return-filter.dto';
import { ReturnResponseDto } from './dto/return-response.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@ApiTags('Sales Returns')
@ApiBearerAuth()
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @Permissions('returns.create')
  @ApiOperation({ summary: 'Create a new sales return' })
  @ApiResponse({
    status: 201,
    description: 'Return created successfully',
    type: ReturnResponseDto,
  })
  async create(
    @Body() createReturnDto: CreateReturnDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const salesReturn = await this.returnsService.create(
      createReturnDto,
      currentUser.sub,
    );
    return new ReturnResponseDto(salesReturn);
  }

  @Get()
  @Permissions('returns.read')
  @ApiOperation({ summary: 'Get all returns with filters and pagination' })
  @ApiPaginatedResponse(ReturnResponseDto)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ReturnFilterDto,
  ) {
    const result = await this.returnsService.findAll(paginationDto, filterDto);
    return {
      data: result.data.map((r) => new ReturnResponseDto(r)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @Permissions('returns.read')
  @ApiOperation({ summary: 'Get return by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Return found',
    type: ReturnResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const salesReturn = await this.returnsService.findById(id);
    return new ReturnResponseDto(salesReturn);
  }

  @Patch(':id')
  @Permissions('returns.update')
  @ApiOperation({ summary: 'Update return (pending only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReturnDto: UpdateReturnDto,
  ) {
    const salesReturn = await this.returnsService.update(id, updateReturnDto);
    return new ReturnResponseDto(salesReturn);
  }

  @Post(':id/approve')
  @Permissions('returns.approve')
  @ApiOperation({ summary: 'Approve return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const salesReturn = await this.returnsService.approve(id, currentUser.sub);
    return new ReturnResponseDto(salesReturn);
  }

  @Post(':id/receive')
  @Permissions('returns.update')
  @ApiOperation({ summary: 'Receive returned items' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async receive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const salesReturn = await this.returnsService.receive(id, currentUser.sub);
    return new ReturnResponseDto(salesReturn);
  }

  @Post(':id/refund')
  @Permissions('returns.refund')
  @ApiOperation({ summary: 'Process refund' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async processRefund(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('refundAmount') refundAmount: number,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const salesReturn = await this.returnsService.processRefund(
      id,
      refundAmount,
      currentUser.sub,
    );
    return new ReturnResponseDto(salesReturn);
  }

  @Post(':id/complete')
  @Permissions('returns.update')
  @ApiOperation({ summary: 'Complete return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    const salesReturn = await this.returnsService.complete(id);
    return new ReturnResponseDto(salesReturn);
  }

  @Post(':id/reject')
  @Permissions('returns.approve')
  @ApiOperation({ summary: 'Reject return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const salesReturn = await this.returnsService.reject(
      id,
      currentUser.sub,
      reason,
    );
    return new ReturnResponseDto(salesReturn);
  }

  @Post(':id/cancel')
  @Permissions('returns.update')
  @ApiOperation({ summary: 'Cancel return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const salesReturn = await this.returnsService.cancel(
      id,
      currentUser.sub,
      reason,
    );
    return new ReturnResponseDto(salesReturn);
  }

  @Delete(':id')
  @Permissions('returns.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete return (pending only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.returnsService.remove(id);
  }
}
