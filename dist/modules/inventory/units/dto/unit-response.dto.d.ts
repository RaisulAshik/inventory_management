import { UomType } from '@common/enums';
import { UnitOfMeasure } from '@entities/tenant';
export declare class UnitResponseDto {
    id: string;
    uomCode: string;
    uomName: string;
    uomType: UomType;
    symbol?: string;
    decimalPlaces: number;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(uom: UnitOfMeasure);
}
