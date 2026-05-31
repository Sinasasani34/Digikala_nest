import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductDetail } from "./product-detail.entity";
import { ProductSize } from "./product-size.entity";
import { ProductColor } from "./product-color.entity";
import { ProductType } from "../enum/type.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { ProductCategoryEntity } from "./product-category.entity";
import { BasketEntity } from "src/modules/basket/entity/basket.entity";

@Entity("product")
export class Product {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  slug: string;

  @Column()
  code: string;

  @Column({ type: "enum", enum: ProductType })
  type: string;

  @Column({ default: 0 })
  count: number;

  @Column({ type: "decimal", nullable: true })
  price: number;

  @Column({ type: "decimal", nullable: true, default: 0 })
  discount: number;

  @Column({ nullable: true, default: false })
  active_discount: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ProductDetail, (detail) => detail.product)
  details: ProductDetail[];

  @OneToMany(() => ProductColor, (color) => color.product)
  colors: ProductColor[];

  @OneToMany(() => ProductSize, (size) => size.product)
  sizes: ProductSize[];

  @ManyToOne(() => CategoryEntity, (category) => category.product_category, {
    onDelete: "CASCADE",
  })
  category: CategoryEntity;

  @OneToMany(() => ProductCategoryEntity, (category) => category.product)
  categories: ProductCategoryEntity[];

  @OneToMany(() => BasketEntity, (basket) => basket.product)
  baskets: BasketEntity[];
}
