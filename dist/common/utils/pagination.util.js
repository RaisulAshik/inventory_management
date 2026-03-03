"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
exports.createPaginationMeta = createPaginationMeta;
exports.paginateArray = paginateArray;
async function paginate(queryBuilder, paginationDto) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 20;
    const skip = (page - 1) * limit;
    if (paginationDto.sortBy) {
        const sortOrder = paginationDto.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        if (paginationDto.sortBy.includes('.')) {
            queryBuilder.orderBy(paginationDto.sortBy, sortOrder);
        }
        else {
            const alias = queryBuilder.alias;
            queryBuilder.orderBy(`${alias}.${paginationDto.sortBy}`, sortOrder);
        }
    }
    const total = await queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const data = await queryBuilder.getMany();
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const meta = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    };
    return { data, meta };
}
function createPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}
function paginateArray(array, page, limit) {
    const total = array.length;
    const skip = (page - 1) * limit;
    const data = array.slice(skip, skip + limit);
    const meta = createPaginationMeta(total, page, limit);
    return { data, meta };
}
//# sourceMappingURL=pagination.util.js.map