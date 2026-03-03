import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  //ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { StockFilterDto } from './dto/stock-filter.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@ApiTags('Stock')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Permissions('stock.read')
  @ApiOperation({ summary: 'Get stock with filters and pagination' })
  async getStock(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: StockFilterDto,
  ) {
    const result = await this.stockService.getStock(paginationDto, filterDto);
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
  async getMovements(
    @Query() paginationDto: PaginationDto,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('movementType') movementType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const result = await this.stockService.getMovements(paginationDto, {
      productId,
      warehouseId,
      movementType: movementType as any,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
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
