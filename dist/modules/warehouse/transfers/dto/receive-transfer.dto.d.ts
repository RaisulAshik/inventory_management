declare class ReceiveItemDto {
    itemId: string;
    quantityReceived: number;
    quantityDamaged?: number;
}
export declare class ReceiveTransferDto {
    items: ReceiveItemDto[];
}
export {};
