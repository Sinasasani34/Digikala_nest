import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductColor } from "./entities/product-color.entity";
import { ProductSize } from "./entities/product-size.entity";
import { ProductDetail } from "./entities/product-detail.entity";
import { ProductController } from "./controllers/product.controller";
import { ProductSizeController } from "./controllers/prodcut.size.controller";
import { ProductColorController } from "./controllers/product.color.controller";
import { ProductDetailController } from "./controllers/product.detail.controller";
import { ProductService } from "./services/product.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { CategoryService } from "../category/category.service";
import { ProductCategoryEntity } from "./entities/product-category.entity";
import { ProductDetailService } from "./services/product-detail.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductColor,
      ProductSize,
      ProductDetail,
      CategoryEntity,
      ProductCategoryEntity
    ]),
  ],
  controllers: [
    ProductController,
    ProductSizeController,
    ProductColorController,
    ProductDetailController,
  ],
  providers: [ProductService, CategoryService, ProductDetailService],
})
export class ProductModule {}
