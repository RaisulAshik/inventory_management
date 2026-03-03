"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const product_category_entity_1 = require("../../../entities/tenant/inventory/product-category.entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let CategoriesService = class CategoriesService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getCategoryRepository() {
        return this.tenantConnectionManager.getRepository(product_category_entity_1.ProductCategory);
    }
    async create(createCategoryDto) {
        const categoryRepo = await this.getCategoryRepository();
        const existingCategory = await categoryRepo.findOne({
            where: { categoryCode: createCategoryDto.categoryCode },
        });
        if (existingCategory) {
            throw new common_1.BadRequestException(`Category with code ${createCategoryDto.categoryCode} already exists`);
        }
        let level = 0;
        let path = '';
        if (createCategoryDto.parentId) {
            const parent = await this.findById(createCategoryDto.parentId);
            level = parent.level + 1;
            path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
        }
        const category = categoryRepo.create({
            id: (0, uuid_1.v4)(),
            ...createCategoryDto,
            level,
            path,
        });
        return categoryRepo.save(category);
    }
    async findAll(paginationDto) {
        const categoryRepo = await this.getCategoryRepository();
        const queryBuilder = categoryRepo
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.parent', 'parent');
        if (paginationDto.search) {
            queryBuilder.where('(category.categoryCode LIKE :search OR category.categoryName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'sortOrder';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async getTree() {
        const categoryRepo = await this.getCategoryRepository();
        const categories = await categoryRepo.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC', categoryName: 'ASC' },
        });
        return this.buildTree(categories);
    }
    buildTree(categories, parentId = null) {
        const tree = [];
        for (const category of categories) {
            if (category.parentId === parentId) {
                const children = this.buildTree(categories, category.id);
                if (children.length > 0) {
                    category.children = children;
                }
                tree.push(category);
            }
        }
        return tree;
    }
    async findAllActive() {
        const categoryRepo = await this.getCategoryRepository();
        return categoryRepo.find({
            where: { isActive: true },
            order: { categoryName: 'ASC' },
        });
    }
    async findById(id) {
        const categoryRepo = await this.getCategoryRepository();
        const category = await categoryRepo.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findByCode(code) {
        const categoryRepo = await this.getCategoryRepository();
        return categoryRepo.findOne({
            where: { categoryCode: code },
        });
    }
    async update(id, updateCategoryDto) {
        const categoryRepo = await this.getCategoryRepository();
        const category = await this.findById(id);
        if (updateCategoryDto.categoryCode &&
            updateCategoryDto.categoryCode !== category.categoryCode) {
            const existingCode = await categoryRepo.findOne({
                where: { categoryCode: updateCategoryDto.categoryCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Category with code ${updateCategoryDto.categoryCode} already exists`);
            }
        }
        if (updateCategoryDto.parentId !== undefined) {
            if (updateCategoryDto.parentId === id) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
            }
            if (updateCategoryDto.parentId) {
                const parent = await this.findById(updateCategoryDto.parentId);
                if (parent.path && parent.path.includes(id)) {
                    throw new common_1.BadRequestException('Circular reference detected');
                }
                category.level = parent.level + 1;
                category.path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
            }
            else {
                category.level = 0;
                category.path = '';
            }
        }
        Object.assign(category, updateCategoryDto);
        return categoryRepo.save(category);
    }
    async remove(id) {
        const categoryRepo = await this.getCategoryRepository();
        const category = await this.findById(id);
        if (category.children && category.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with child categories');
        }
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const productCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('products', 'p')
            .where('p.category_id = :id', { id })
            .andWhere('p.deleted_at IS NULL')
            .getRawOne();
        if (parseInt(productCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete category with associated products');
        }
        await categoryRepo.delete(id);
    }
    async getChildren(parentId) {
        const categoryRepo = await this.getCategoryRepository();
        return categoryRepo.find({
            where: { parentId, isActive: true },
            order: { sortOrder: 'ASC', categoryName: 'ASC' },
        });
    }
    async getDescendants(id) {
        const categoryRepo = await this.getCategoryRepository();
        return categoryRepo
            .createQueryBuilder('category')
            .where('category.path LIKE :path', { path: `%${id}%` })
            .orWhere('category.parentId = :id', { id })
            .orderBy('category.level', 'ASC')
            .addOrderBy('category.sortOrder', 'ASC')
            .getMany();
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map