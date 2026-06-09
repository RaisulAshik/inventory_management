import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { format as csvFormat } from 'fast-csv';
import { StockService } from './stock.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { StockFilterDto, StockMovementFilterDto, ExportStockFilterDto, ExportMovementFilterDto } from './dto/stock-filter.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@ApiTags('Stock')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get stock with filters and pagination' })
  async getStock(@Query() filterDto: StockFilterDto) {
    if (filterDto.status === 'outOfStock') filterDto.outOfStock = true;
    else if (filterDto.status === 'lowStock') filterDto.lowStock = true;
    const result = await this.stockService.getStock(filterDto, filterDto);
    return result;
  }

  @Get('low-stock')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get low stock products' })
  @ApiQuery({ name: 'warehouseId', required: false })
  async getLowStock(@Query('warehouseId') warehouseId?: string) {
    const products = await this.stockService.getLowStockProducts(warehouseId);
    return { data: products };
  }

  @Get('valuation')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get stock valuation' })
  @ApiQuery({ name: 'warehouseId', required: false })
  async getValuation(@Query('warehouseId') warehouseId?: string) {
    const valuation = await this.stockService.getStockValuation(warehouseId);
    return valuation;
  }

  @Get('movements')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get stock movements' })
  async getMovements(@Query() filterDto: StockMovementFilterDto) {
    const result = await this.stockService.getMovements(filterDto, {
      productId: filterDto.productId,
      warehouseId: filterDto.warehouseId,
      movementType: filterDto.movementType,
      fromDate: filterDto.fromDate ? new Date(filterDto.fromDate) : undefined,
      toDate: filterDto.toDate ? new Date(filterDto.toDate) : undefined,
    });
    return result;
  }

  @Get('product/:productId')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get stock by product' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  async getStockByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const stock = await this.stockService.getStockByProduct(productId);
    return { data: stock };
  }

  @Get('warehouse/:warehouseId')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get stock by warehouse' })
  @ApiParam({ name: 'warehouseId', type: 'string', format: 'uuid' })
  async getStockByWarehouse(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.stockService.getStockByWarehouse(
      warehouseId,
      paginationDto,
    );
    return result;
  }

  @Get('warehouse/:warehouseId/locations')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get location-wise inventory for a warehouse' })
  @ApiParam({ name: 'warehouseId', type: 'string', format: 'uuid' })
  async getLocationInventory(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
  ) {
    const inventory = await this.stockService.getLocationInventory(warehouseId);
    return { data: inventory };
  }

  @Get('available/:productId/:warehouseId')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get available quantity for a product' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'warehouseId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'variantId', required: false })
  async getAvailableQuantity(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
    @Query('variantId') variantId?: string,
  ) {
    const quantity = await this.stockService.getAvailableQuantity(
      productId,
      warehouseId,
      variantId,
    );
    return { availableQuantity: quantity };
  }

  @Get('export')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Export stock levels to CSV or Excel' })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['csv', 'xlsx'],
    description: 'Default: csv',
  })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'sku', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['inStock', 'lowStock', 'outOfStock'],
  })
  async exportStock(
    @Query() filterDto: ExportStockFilterDto,
    @Res() res: Response,
  ) {
    if (filterDto.status === 'outOfStock') filterDto.outOfStock = true;
    else if (filterDto.status === 'lowStock') filterDto.lowStock = true;
    const exportFormat = filterDto.format ?? 'csv';
    const rows = await this.stockService.exportStockData(filterDto);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `stock-export-${timestamp}`;

    if (exportFormat === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Stock');

      if (rows.length > 0) {
        // Header row
        const headers = Object.keys(rows[0]);
        const headerRow = sheet.addRow(headers);
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1F4E79' },
        };
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headers.forEach((_, i) => {
          sheet.getColumn(i + 1).width = 18;
        });

        // Data rows
        rows.forEach((row) => sheet.addRow(Object.values(row)));

        // Freeze header row
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
      }

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.xlsx"`,
      );
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.csv"`,
      );

      const csvStream = csvFormat({ headers: true });
      csvStream.pipe(res);
      rows.forEach((row) => csvStream.write(row));
      csvStream.end();
    }
  }

  @Get('movements/export')
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Export stock movements to CSV or Excel' })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['csv', 'xlsx'],
    description: 'Default: csv',
  })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'movementType', required: false })
  @ApiQuery({ name: 'fromDate', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'toDate', required: false, description: 'YYYY-MM-DD' })
  async exportMovements(
    @Query() filterDto: ExportMovementFilterDto,
    @Res() res: Response,
  ) {
    const exportFormat = filterDto.format ?? 'csv';
    const rows = await this.stockService.exportMovementsData({
      productId: filterDto.productId,
      warehouseId: filterDto.warehouseId,
      movementType: filterDto.movementType,
      fromDate: filterDto.fromDate,
      toDate: filterDto.toDate,
    });
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `stock-movements-${timestamp}`;

    if (exportFormat === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Movements');

      if (rows.length > 0) {
        const headers = Object.keys(rows[0]);
        const headerRow = sheet.addRow(headers);
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1F4E79' },
        };
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headers.forEach((_, i) => {
          sheet.getColumn(i + 1).width = 20;
        });
        rows.forEach((row) => sheet.addRow(Object.values(row)));
        sheet.views = [{ state: 'frozen', ySplit: 1 }];
      }

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.xlsx"`,
      );
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.csv"`,
      );

      const csvStream = csvFormat({ headers: true });
      csvStream.pipe(res);
      rows.forEach((row) => csvStream.write(row));
      csvStream.end();
    }
  }

  @Post('movement')
  @Permissions('stock.write')
  @ApiOperation({ summary: 'Record stock movement' })
  async recordMovement(
    @Body() movementDto: StockMovementDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const movement = await this.stockService.recordMovement(
      movementDto,
      currentUser.sub,
    );
    return movement;
  }

  @Post('reserve')
  @Permissions('stock.write')
  @ApiOperation({ summary: 'Reserve stock' })
  async reserveStock(
    @Body()
    body: {
      productId: string;
      warehouseId: string;
      quantity: number;
      variantId?: string;
    },
  ) {
    await this.stockService.reserveStock(
      body.productId,
      body.warehouseId,
      body.quantity,
      body.variantId,
    );
    return { message: 'Stock reserved successfully' };
  }

  @Post('release')
  @Permissions('stock.write')
  @ApiOperation({ summary: 'Release reserved stock' })
  async releaseStock(
    @Body()
    body: {
      productId: string;
      warehouseId: string;
      quantity: number;
      variantId?: string;
    },
  ) {
    await this.stockService.releaseStock(
      body.productId,
      body.warehouseId,
      body.quantity,
      body.variantId,
    );
    return { message: 'Stock released successfully' };
  }
}
