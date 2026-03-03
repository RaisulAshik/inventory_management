import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: CategoryResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    getTree(): Promise<{
        data: import("../../../entities/tenant").ProductCategory[];
    }>;
    findAllActive(): Promise<{
        data: CategoryResponseDto[];
    }>;
    findOne(id: string): Promise<CategoryResponseDto>;
    getChildren(id: string): Promise<{
        data: CategoryResponseDto[];
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    remove(id: string): Promise<void>;
}
