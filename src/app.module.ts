import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./modules/product/product.module";
import { TypeOrmConfig } from "./config/typeorm.config";
import { CategoryModule } from "./modules/category/category.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
