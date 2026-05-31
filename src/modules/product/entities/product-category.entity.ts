import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity("product-category")
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  productId: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Product, (product) => product.categories)
  product: Product;

  @ManyToOne(() => CategoryEntity, (category) => category.product_categories, {
    onDelete: "CASCADE",
  })
  category: CategoryEntity;
}