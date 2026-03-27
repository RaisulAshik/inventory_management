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
import { TransfersService } from './transfers.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ReceiveTransferDto } from './dto/receive-transfer.dto';
import { TransferFilterDto } from './dto/transfer-filter.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@ApiTags('Warehouse Transfers')
@ApiBearerAuth()
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @Permissions('transfers.create')
  @ApiOperation({ summary: 'Create a new transfer' })
  @ApiResponse({
    status: 201,
    description: 'Transfer created successfully',
    type: TransferResponseDto,
  })
  async create(
    @Body() createTransferDto: CreateTransferDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.create(
      createTransferDto,
      currentUser.sub,
    );
    return new TransferResponseDto(transfer);
  }

  @Get()
  @Permissions('transfers.read')
  @ApiOperation({ summary: 'Get all transfers with filters and pagination' })
  @ApiPaginatedResponse(TransferResponseDto)
  async findAll(
    @Query() filterDto: TransferFilterDto,
  ) {
    const result = await this.transfersService.findAll(filterDto);
    return {
      data: result.data.map((t) => new TransferResponseDto(t)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @Permissions('transfers.read')
  @ApiOperation({ summary: 'Get transfer by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Transfer found',
    type: TransferResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const transfer = await this.transfersService.findById(id);
    return new TransferResponseDto(transfer);
  }

  @Patch(':id')
  @Permissions('transfers.update')
  @ApiOperation({ summary: 'Update transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransferDto: UpdateTransferDto,
  ) {
    const transfer = await this.transfersService.update(id, updateTransferDto);
    return new TransferResponseDto(transfer);
  }

  @Post(':id/submit')
  @Permissions('transfers.update')
  @ApiOperation({ summary: 'Submit transfer for approval' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async submitForApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.submitForApproval(
      id,
      currentUser.sub,
    );
    return new TransferResponseDto(transfer);
  }

  @Post(':id/approve')
  @Permissions('transfers.approve')
  @ApiOperation({ summary: 'Approve transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.approve(id, currentUser.sub);
    return new TransferResponseDto(transfer);
  }

  @Post(':id/reject')
  @Permissions('transfers.approve')
  @ApiOperation({ summary: 'Reject transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.reject(
      id,
      currentUser.sub,
      reason,
    );
    return new TransferResponseDto(transfer);
  }

  @Post(':id/ship')
  @Permissions('transfers.ship')
  @ApiOperation({ summary: 'Ship transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async ship(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('trackingNumber') trackingNumber: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.ship(
      id,
      currentUser.sub,
      trackingNumber,
    );
    return new TransferResponseDto(transfer);
  }

  @Post(':id/receive')
  @Permissions('transfers.receive')
  @ApiOperation({ summary: 'Receive transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async receive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() receiveDto: ReceiveTransferDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.receive(
      id,
      currentUser.sub,
      receiveDto.items,
    );
    return new TransferResponseDto(transfer);
  }

  @Post(':id/cancel')
  @Permissions('transfers.update')
  @ApiOperation({ summary: 'Cancel transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const transfer = await this.transfersService.cancel(
      id,
      currentUser.sub,
      reason,
    );
    return new TransferResponseDto(transfer);
  }

  @Delete(':id')
  @Permissions('transfers.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete transfer (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.transfersService.remove(id);
  }

  // Item endpoints
  @Post(':id/items')
  @Permissions('transfers.update')
  @ApiOperation({ summary: 'Add item to transfer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: CreateTransferItemDto,
  ) {
    const item = await this.transfersService.addItem(id, itemDto);
    return item;
  }

  @Patch('items/:itemId')
  @Permissions('transfers.update')
  @ApiOperation({ summary: 'Update transfer item' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() itemDto: Partial<CreateTransferItemDto>,
  ) {
    const item = await this.transfersService.updateItem(itemId, itemDto);
    return item;
  }

  @Delete('items/:itemId')
  @Permissions('transfers.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove transfer item' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async removeItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    await this.transfersService.removeItem(itemId);
  }
}
