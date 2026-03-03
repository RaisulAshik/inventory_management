import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: BrandResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    findAllActive(): Promise<{
        data: BrandResponseDto[];
    }>;
    findOne(id: string): Promise<BrandResponseDto>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<BrandResponseDto>;
    remove(id: string): Promise<void>;
}
