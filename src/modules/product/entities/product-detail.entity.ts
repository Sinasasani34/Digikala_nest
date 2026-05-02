import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("product_detail")
export class ProductDetail {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  productId: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, product => product.details, {onDelete: "CASCADE"})
  product: Product;
}
