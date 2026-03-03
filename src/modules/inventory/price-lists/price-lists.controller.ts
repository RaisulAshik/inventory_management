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
import { PriceListsService } from './price-lists.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { PriceListType } from '@entities/tenant';
import { CreatePriceListItemDto } from './dto/create-price-list-item.dto';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { PriceListResponseDto } from './dto/price-list-response.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';

@ApiTags('Price Lists')
@ApiBearerAuth()
@Controller('price-lists')
export class PriceListsController {
  constructor(private readonly priceListsService: PriceListsService) {}

  @Post()
  @Permissions('price-lists.create')
  @ApiOperation({ summary: 'Create a new price list' })
  @ApiResponse({
    status: 201,
    description: 'Price list created successfully',
    type: PriceListResponseDto,
  })
  async create(
    @Body() createPriceListDto: CreatePriceListDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const priceList = await this.priceListsService.create(
      createPriceListDto,
      currentUser.sub,
    );
    return new PriceListResponseDto(priceList);
  }

  @Get()
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get all price lists with pagination' })
  @ApiPaginatedResponse(PriceListResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.priceListsService.findAll(paginationDto);
    return {
      data: result.data.map((pl) => new PriceListResponseDto(pl)),
      meta: result.meta,
    };
  }

  @Get('active')
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get all active price lists (for dropdowns)' })
  async findAllActive() {
    const priceLists = await this.priceListsService.findAllActive();
    return { data: priceLists.map((pl) => new PriceListResponseDto(pl)) };
  }
  @Get('type/:type')
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get price lists by type' })
  @ApiParam({ name: 'type', enum: PriceListType })
  async findByType(@Param('type') type: PriceListType) {
    const priceLists = await this.priceListsService.findByType(type);
    return { data: priceLists.map((pl) => new PriceListResponseDto(pl)) };
  }

  @Get('default/:type')
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get default price list by type' })
  @ApiParam({ name: 'type', enum: PriceListType })
  async getDefault(@Param('type') type: PriceListType) {
    const priceList = await this.priceListsService.getDefault(type);
    return { data: priceList ? new PriceListResponseDto(priceList) : null };
  }

  @Get('price')
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get product price from a price list' })
  @ApiQuery({ name: 'priceListId', required: true })
  @ApiQuery({ name: 'productId', required: true })
  @ApiQuery({ name: 'quantity', required: false })
  @ApiQuery({ name: 'variantId', required: false })
  async getProductPrice(
    @Query('priceListId') priceListId: string,
    @Query('productId') productId: string,
    @Query('quantity') quantity?: number,
    @Query('variantId') variantId?: string,
  ) {
    const price = await this.priceListsService.getProductPrice(
      priceListId,
      productId,
      quantity ? Number(quantity) : 1,
      variantId,
    );
    return { price };
  }

  @Get(':id')
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get price list by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Price list found',
    type: PriceListResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const priceList = await this.priceListsService.findById(id);
    return new PriceListResponseDto(priceList);
  }

  @Get(':id/items')
  @Permissions('price-lists.read')
  @ApiOperation({ summary: 'Get price list items' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getItems(@Param('id', ParseUUIDPipe) id: string) {
    const items = await this.priceListsService.getItems(id);
    return { data: items };
  }

  @Patch(':id')
  @Permissions('price-lists.update')
  @ApiOperation({ summary: 'Update price list' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePriceListDto: UpdatePriceListDto,
  ) {
    const priceList = await this.priceListsService.update(
      id,
      updatePriceListDto,
    );
    return new PriceListResponseDto(priceList);
  }

  @Delete(':id')
  @Permissions('price-lists.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete price list' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.priceListsService.remove(id);
  }

  @Post(':id/copy')
  @Permissions('price-lists.create')
  @ApiOperation({ summary: 'Copy price list' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async copyPriceList(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { newCode: string; newName: string },
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const priceList = await this.priceListsService.copyPriceList(
      id,
      body.newCode,
      body.newName,
      currentUser.sub,
    );
    return new PriceListResponseDto(priceList);
  }

  // Item endpoints
  @Post(':id/items')
  @Permissions('price-lists.update')
  @ApiOperation({ summary: 'Add item to price list' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: CreatePriceListItemDto,
  ) {
    const item = await this.priceListsService.addItem(id, itemDto);
    return item;
  }

  @Post(':id/items/bulk')
  @Permissions('price-lists.update')
  @ApiOperation({ summary: 'Bulk add items to price list' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async bulkAddItems(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { items: CreatePriceListItemDto[] },
  ) {
    const result = await this.priceListsService.bulkAddItems(id, body.items);
    return result;
  }

  @Patch('items/:itemId')
  @Permissions('price-lists.update')
  @ApiOperation({ summary: 'Update price list item' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async updateItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() itemDto: Partial<CreatePriceListItemDto>,
  ) {
    const item = await this.priceListsService.updateItem(itemId, itemDto);
    return item;
  }

  @Delete('items/:itemId')
  @Permissions('price-lists.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove price list item' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid' })
  async removeItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    await this.priceListsService.removeItem(itemId);
  }
}
