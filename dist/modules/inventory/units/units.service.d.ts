import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { UnitOfMeasure } from '@entities/tenant';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateUomConversionDto } from './dto/create-uom-conversion.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UomConversion } from '@entities/tenant/inventory/uom-conversion.entity';
export declare class UnitsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getUomRepository;
    create(createUnitDto: CreateUnitDto): Promise<UnitOfMeasure>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<UnitOfMeasure>>;
    findAllActive(): Promise<UnitOfMeasure[]>;
    findByType(uomType: string): Promise<UnitOfMeasure[]>;
    findById(id: string): Promise<UnitOfMeasure>;
    findByCode(code: string): Promise<UnitOfMeasure | null>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitOfMeasure>;
    remove(id: string): Promise<void>;
    createConversion(dto: CreateUomConversionDto): Promise<UomConversion>;
    getConversions(uomId: string): Promise<UomConversion[]>;
    convert(fromUomId: string, toUomId: string, quantity: number): Promise<number>;
    updateConversion(conversionId: string, conversionFactor: number): Promise<UomConversion>;
    removeConversion(conversionId: string): Promise<void>;
    count(): Promise<number>;
}
