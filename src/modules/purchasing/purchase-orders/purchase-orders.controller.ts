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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  BulkUploadFileDto,
  BulkValidateItemInput,
} from './dto/bulk-upload-items.dto';
import { PurchaseOrdersService } from './purchase-orders.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderFilterDto } from './dto/purchase-order-filter.dto';
import {
  PurchaseOrderDetailResponseDto,
  PurchaseOrderResponseDto,
} from './dto/purchase-order-response.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  @Permissions('purchase-orders.create')
  @ApiOperation({ summary: 'Create a new purchase order' })
  @ApiResponse({
    status: 201,
    description: 'Purchase order created successfully',
    type: PurchaseOrderResponseDto,
  })
  async create(
    @Body() createDto: CreatePurchaseOrderDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const po = await this.purchaseOrdersService.create(
      createDto,
      currentUser.sub,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Get()
  @Permissions('purchase-orders.read')
  @ApiOperation({
    summary: 'Get all purchase orders with filters and pagination',
  })
  @ApiPaginatedResponse(PurchaseOrderResponseDto)
  async findAll(
    //@Query() paginationDto: PaginationDto,
    @Query() filterDto: PurchaseOrderFilterDto,
  ) {
    const result = await this.purchaseOrdersService.findAll(
      //paginationDto,
      filterDto,
    );
    return {
      data: result.data.map((po) => new PurchaseOrderResponseDto(po)),
      meta: result.meta,
    };
  }

  @Get('overdue')
  @Permissions('purchase-orders.read')
  @ApiOperation({ summary: 'Get overdue purchase orders' })
  async getOverdueOrders() {
    const orders = await this.purchaseOrdersService.getOverdueOrders();
    return { data: orders.map((po) => new PurchaseOrderResponseDto(po)) };
  }

  @Get('supplier/:supplierId/pending')
  @Permissions('purchase-orders.read')
  @ApiOperation({ summary: 'Get pending orders for a supplier' })
  @ApiParam({ name: 'supplierId', type: 'string', format: 'uuid' })
  async getPendingForSupplier(
    @Param('supplierId', ParseUUIDPipe) supplierId: string,
  ) {
    const orders =
      await this.purchaseOrdersService.getPendingOrdersForSupplier(supplierId);
    return { data: orders.map((po) => new PurchaseOrderResponseDto(po)) };
  }

  @Get('search/number/:poNumber')
  @Permissions('purchase-orders.read')
  @ApiOperation({ summary: 'Find purchase order by number' })
  @ApiParam({ name: 'poNumber', type: 'string' })
  async findByNumber(@Param('poNumber') poNumber: string) {
    const po = await this.purchaseOrdersService.findByNumber(poNumber);
    return { data: po ? new PurchaseOrderResponseDto(po) : null };
  }

  @Get(':id')
  @Permissions('purchase-orders.read')
  @ApiOperation({ summary: 'Get purchase order by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Purchase order found',
    type: PurchaseOrderDetailResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const po = await this.purchaseOrdersService.findById(id);
    return new PurchaseOrderDetailResponseDto(po);
  }

  @Patch(':id')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Update purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePurchaseOrderDto,
  ) {
    const po = await this.purchaseOrdersService.update(id, updateDto);
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/items')
  @SkipThrottle()
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Add a line item to a purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreatePurchaseOrderItemDto,
  ) {
    const item = await this.purchaseOrdersService.addItem(id, body);
    return { data: item };
  }

  @Patch(':id/items/:itemId')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Update a line item on a purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: UpdatePurchaseOrderItemDto,
  ) {
    const item = await this.purchaseOrdersService.updateItem(id, itemId, body);
    return { data: item };
  }

  @Delete(':id/items/:itemId')
  @Permissions('purchase-orders.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a line item from a purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    await this.purchaseOrdersService.removeItem(id, itemId);
  }

  @Post(':id/submit')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Submit purchase order for approval' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async submitForApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('approverId') approverId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const po = await this.purchaseOrdersService.submitForApproval(
      id,
      approverId,
      currentUser.sub,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/approve')
  @Permissions('purchase-orders.approve')
  @ApiOperation({ summary: 'Approve purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('approverId') approverId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const po = await this.purchaseOrdersService.approve(
      id,
      approverId,
      currentUser.sub,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/reject')
  @Permissions('purchase-orders.approve')
  @ApiOperation({ summary: 'Reject purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const po = await this.purchaseOrdersService.reject(
      id,
      currentUser.sub,
      reason,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/send')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Send purchase order to supplier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async sendToSupplier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('senderId') senderId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const po = await this.purchaseOrdersService.sendToSupplier(
      id,
      senderId,
      currentUser.sub,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/acknowledge')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Mark purchase order as acknowledged by supplier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async acknowledge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('acknowledgementNumber') acknowledgementNumber?: string,
  ) {
    const po = await this.purchaseOrdersService.acknowledge(
      id,
      acknowledgementNumber,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/close')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Close purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async close(@Param('id', ParseUUIDPipe) id: string) {
    const po = await this.purchaseOrdersService.close(id);
    return new PurchaseOrderResponseDto(po);
  }

  @Post(':id/cancel')
  @Permissions('purchase-orders.update')
  @ApiOperation({ summary: 'Cancel purchase order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const po = await this.purchaseOrdersService.cancel(
      id,
      currentUser.sub,
      reason,
    );
    return new PurchaseOrderResponseDto(po);
  }

  @Delete(':id')
  @Permissions('purchase-orders.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete purchase order (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.purchaseOrdersService.remove(id);
  }

  // ── Bulk validate ────────────────────────────────────────────────────────

  @Post('items/bulk-validate')
  @SkipThrottle()
  @Permissions('purchase-orders.read')
  @ApiOperation({
    summary: 'Validate a batch of SKUs before bulk import',
    description:
      'Returns found/not_found status for each SKU. ' +
      'Call this before creating a PO to preview which items will succeed.',
  })
  async bulkValidateItems(@Body() body: { items: BulkValidateItemInput[] }) {
    return this.purchaseOrdersService.bulkValidateItems(body.items ?? []);
  }

  // ── Bulk upload ──────────────────────────────────────────────────────────

  @Get('bulk-upload/template')
  @SkipThrottle()
  @Permissions('purchase-orders.read')
  @ApiOperation({
    summary: 'Download Excel template for bulk item upload',
    description:
      'Returns an .xlsx file with the correct column headers and a sample row.',
  })
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.purchaseOrdersService.generateUploadTemplate();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="po-items-template.xlsx"',
    );
    res.send(buffer);
  }

  @Post(':id/items/bulk-upload')
  @SkipThrottle()
  @Permissions('purchase-orders.update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BulkUploadFileDto })
  @ApiOperation({
    summary: 'Bulk upload line items from Excel or CSV',
    description:
      'Upload an .xlsx or .csv file to add multiple line items at once. ' +
      'Download the template from GET /purchase-orders/bulk-upload/template. ' +
      'Returns a summary of succeeded / failed rows with per-row error details.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async bulkUploadItems(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.purchaseOrdersService.bulkUploadItems(id, file);
  }
}
