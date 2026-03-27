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
import { PurchaseReturnsService } from './purchase-returns.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreatePurchaseReturnDto } from './dto/create-purchase-return.dto';
import { ProcessCreditNoteDto } from './dto/process-credit-note.dto';
import { PurchaseReturnFilterDto } from './dto/purchase-return-filter.dto';
import { PurchaseReturnResponseDto } from './dto/purchase-return-response.dto';
import { UpdatePurchaseReturnDto } from './dto/update-purchase-return.dto';

@ApiTags('Purchase Returns')
@ApiBearerAuth()
@Controller('purchase-returns')
export class PurchaseReturnsController {
  constructor(
    private readonly purchaseReturnsService: PurchaseReturnsService,
  ) {}

  @Post()
  @Permissions('purchase-returns.create')
  @ApiOperation({ summary: 'Create a new purchase return' })
  @ApiResponse({
    status: 201,
    description: 'Purchase return created successfully',
    type: PurchaseReturnResponseDto,
  })
  async create(
    @Body() createDto: CreatePurchaseReturnDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.create(
      createDto,
      currentUser.sub,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Get()
  @Permissions('purchase-returns.read')
  @ApiOperation({
    summary: 'Get all purchase returns with filters and pagination',
  })
  @ApiPaginatedResponse(PurchaseReturnResponseDto)
  async findAll(
    @Query() filterDto: PurchaseReturnFilterDto,
  ) {
    const result = await this.purchaseReturnsService.findAll(filterDto);
    return {
      data: result.data.map((r) => new PurchaseReturnResponseDto(r)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @Permissions('purchase-returns.read')
  @ApiOperation({ summary: 'Get purchase return by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Purchase return found',
    type: PurchaseReturnResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const purchaseReturn = await this.purchaseReturnsService.findById(id);
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Patch(':id')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Update purchase return (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePurchaseReturnDto,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.update(
      id,
      updateDto,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/submit')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Submit purchase return for approval' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async submitForApproval(@Param('id', ParseUUIDPipe) id: string) {
    const purchaseReturn =
      await this.purchaseReturnsService.submitForApproval(id);
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/approve')
  @Permissions('purchase-returns.approve')
  @ApiOperation({ summary: 'Approve purchase return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.approve(
      id,
      currentUser.sub,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/reject')
  @Permissions('purchase-returns.approve')
  @ApiOperation({ summary: 'Reject purchase return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.reject(
      id,
      currentUser.sub,
      reason,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/ship')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Ship return to supplier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async ship(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('trackingNumber') trackingNumber: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.ship(
      id,
      currentUser.sub,
      trackingNumber,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/confirm-receipt')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Confirm supplier received the return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async confirmReceipt(@Param('id', ParseUUIDPipe) id: string) {
    const purchaseReturn = await this.purchaseReturnsService.confirmReceipt(id);
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/credit-note')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Process credit note from supplier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async processCreditNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() creditNoteDto: ProcessCreditNoteDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.processCreditNote(
      id,
      creditNoteDto.creditNoteNumber,
      creditNoteDto.creditAmount,
      currentUser.sub,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/complete')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Complete purchase return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    const purchaseReturn = await this.purchaseReturnsService.complete(id);
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Post(':id/cancel')
  @Permissions('purchase-returns.update')
  @ApiOperation({ summary: 'Cancel purchase return' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const purchaseReturn = await this.purchaseReturnsService.cancel(
      id,
      currentUser.sub,
      reason,
    );
    return new PurchaseReturnResponseDto(purchaseReturn);
  }

  @Delete(':id')
  @Permissions('purchase-returns.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete purchase return (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.purchaseReturnsService.remove(id);
  }
}
