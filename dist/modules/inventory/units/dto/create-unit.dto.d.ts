import { UomType } from '@common/enums';
export declare class CreateUnitDto {
    uomCode: string;
    uomName: string;
    uomType?: UomType;
    symbol?: string;
    decimalPlaces?: number;
    description?: string;
    isActive?: boolean;
}
