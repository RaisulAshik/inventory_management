// src/modules/sales/collections/collections.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { CollectionsService } from './collections.service';
import {
  CreateCollectionDto,
  CollectionFilterDto,
  DepositDto,
  BounceDto,
  AllocateCollectionDto,
} from './dto/create-collection.dto';

@ApiTags('Collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @Permissions('collections.create')
  @ApiOperation({ summary: 'Create collection (with optional allocation)' })
  async create(
    @Body() dto: CreateCollectionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collectionsService.create(dto, user.sub);
  }

  @Get()
  @Permissions('collections.read')
  @ApiOperation({ summary: 'List collections with filters' })
  async findAll(@Query() filterDto: CollectionFilterDto) {
    return this.collectionsService.findAll(filterDto);
  }

  @Get(':id')
  @Permissions('collections.read')
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.collectionsService.findById(id);
  }

  @Post(':id/confirm')
  @Permissions('collections.update')
  @ApiOperation({ summary: 'Confirm collection (for cheque payments)' })
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collectionsService.confirm(id, user.sub);
  }

  @Post(':id/deposit')
  @Permissions('collections.update')
  @ApiOperation({ summary: 'Deposit cheque to bank' })
  async deposit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DepositDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collectionsService.deposit(id, dto, user.sub);
  }

  @Post(':id/bounce')
  @Permissions('collections.update')
  @ApiOperation({ summary: 'Cheque bounce — reverses all allocations' })
  async bounce(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BounceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collectionsService.bounce(id, dto, user.sub);
  }

  @Post(':id/allocate')
  @Permissions('collections.update')
  @ApiOperation({ summary: 'Allocate unallocated amount to dues' })
  async allocate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AllocateCollectionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collectionsService.allocate(id, dto, user.sub);
  }

  @Post(':id/cancel')
  @Permissions('collections.update')
  @ApiOperation({ summary: 'Cancel collection (draft/pending only)' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collectionsService.cancel(id, reason, user.sub);
  }
}
