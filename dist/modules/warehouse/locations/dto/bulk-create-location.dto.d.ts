declare class LocationConfigDto {
    aisleStart: string;
    aisleEnd: string;
    rackStart: string;
    rackEnd: string;
    shelfStart: number;
    shelfEnd: number;
    binStart?: number;
    binEnd?: number;
    locationType: string;
}
export declare class BulkCreateLocationDto {
    warehouseId: string;
    zoneId: string;
    config: LocationConfigDto;
}
export {};
