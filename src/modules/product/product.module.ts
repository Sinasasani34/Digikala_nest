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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductColor,
      ProductSize,
      ProductDetail,
    ]),
  ],
  controllers: [
    ProductController,
    ProductSizeController,
    ProductColorController,
    ProductDetailController,
  ],
  providers: [ProductService],
})
export class ProductModule {}
