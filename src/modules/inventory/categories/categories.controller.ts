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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Permissions('categories.create')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return new CategoryResponseDto(category);
  }

  @Get()
  @Permissions('categories.read')
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiPaginatedResponse(CategoryResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.categoriesService.findAll(paginationDto);
    return {
      data: result.data.map((cat) => new CategoryResponseDto(cat)),
      meta: result.meta,
    };
  }

  @Get('tree')
  @Permissions('categories.read')
  @ApiOperation({ summary: 'Get category tree (hierarchical)' })
  async getTree() {
    const tree = await this.categoriesService.getTree();
    return { data: tree };
  }

  @Get('active')
  @Permissions('categories.read')
  @ApiOperation({ summary: 'Get all active categories (for dropdowns)' })
  async findAllActive() {
    const categories = await this.categoriesService.findAllActive();
    return { data: categories.map((cat) => new CategoryResponseDto(cat)) };
  }

  @Get(':id')
  @Permissions('categories.read')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: CategoryResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    return new CategoryResponseDto(category);
  }

  @Get(':id/children')
  @Permissions('categories.read')
  @ApiOperation({ summary: 'Get child categories' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getChildren(@Param('id', ParseUUIDPipe) id: string) {
    const children = await this.categoriesService.getChildren(id);
    return { data: children.map((cat) => new CategoryResponseDto(cat)) };
  }

  @Patch(':id')
  @Permissions('categories.update')
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return new CategoryResponseDto(category);
  }

  @Delete(':id')
  @Permissions('categories.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoriesService.remove(id);
  }
}
