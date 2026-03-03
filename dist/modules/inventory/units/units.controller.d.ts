import { UnitsService } from './units.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateUomConversionDto } from './dto/create-uom-conversion.dto';
import { UnitResponseDto } from './dto/unit-response.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    create(createUnitDto: CreateUnitDto): Promise<UnitResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: UnitResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    findAllActive(): Promise<{
        data: UnitResponseDto[];
    }>;
    findByType(type: string): Promise<{
        data: UnitResponseDto[];
    }>;
    convert(fromUomId: string, toUomId: string, quantity: number): Promise<{
        convertedQuantity: number;
    }>;
    findOne(id: string): Promise<UnitResponseDto>;
    getConversions(id: string): Promise<{
        data: import("../../../entities/tenant").UomConversion[];
    }>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitResponseDto>;
    remove(id: string): Promise<void>;
    createConversion(dto: CreateUomConversionDto): Promise<import("../../../entities/tenant").UomConversion>;
    updateConversion(conversionId: string, conversionFactor: number): Promise<import("../../../entities/tenant").UomConversion>;
    removeConversion(conversionId: string): Promise<void>;
}
