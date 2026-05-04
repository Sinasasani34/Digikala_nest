import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./modules/product/product.module";
import { TypeOrmConfig } from "./config/typeorm.config";

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
