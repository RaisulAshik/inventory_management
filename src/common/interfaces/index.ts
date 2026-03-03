import { Request } from 'express';
import { Tenant } from '@entities/master';

export interface TenantRequest extends Request {
  tenant?: Tenant;
  user?: JwtPayload;
}

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}

/**
 * Pagination meta interface
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  timestamp: string;
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateRange?: {
    field: string;
    from: Date;
    to: Date;
  };
}

export interface StockCheckResult {
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  isAvailable: boolean;
  shortfall?: number;
}
/**
 * Price calculation result interface
 */
export interface PriceCalculationResult {
  unitPrice: number;
  originalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  taxAmount: number;
  taxPercentage: number;
  lineTotal: number;
}
