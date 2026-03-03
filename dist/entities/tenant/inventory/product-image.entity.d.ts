import { Product } from './product.entity';
export declare class ProductImage {
    id: string;
    productId: string;
    imageUrl: string;
    thumbnailUrl: string;
    altText: string;
    title: string;
    isPrimary: boolean;
    sortOrder: number;
    fileName: string;
    fileSize: number;
    mimeType: string;
    width: number;
    height: number;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
}
