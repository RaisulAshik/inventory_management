import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { BrandsController } from './brands/brands.controller';
import { BrandsService } from './brands/brands.service';
import { SuppliersController } from './suppliers/suppliers.controller';
import { SuppliersService } from './suppliers/suppliers.service';
import { DatabaseModule } from '@database/database.module';
import { PriceListsController } from './price-lists/price-lists.controller';
import { PriceListsService } from './price-lists/price-lists.service';
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';
import { TaxController } from './tax/tax.controller';
import { TaxService } from './tax/tax.service';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    BrandsController,
    SuppliersController,
    UnitsController,
    PriceListsController,
    TaxController,
  ],
  providers: [
    ProductsService,
    CategoriesService,
    BrandsService,
    SuppliersService,
    UnitsService,
    PriceListsService,
    TaxService,
  ],
  exports: [
    ProductsService,
    CategoriesService,
    BrandsService,
    SuppliersService,
    UnitsService,
    PriceListsService,
    TaxService,
  ],
})
export class InventoryModule {}
