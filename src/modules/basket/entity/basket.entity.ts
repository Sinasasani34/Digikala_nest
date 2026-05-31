import { DiscountEntity } from "src/modules/discount/entity/discount.entity";
import { ProductColor } from "src/modules/product/entities/product-color.entity";
import { ProductSize } from "src/modules/product/entities/product-size.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BasketEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  productId: number;

  @Column({ nullable: true })
  sizeId: number;

  @Column({ nullable: true })
  colorId: number;

  @Column({ nullable: true })
  discountId: number;

  @Column()
  count: number;

  @ManyToOne(() => Product, (product) => product.baskets, {
    onDelete: "CASCADE",
  })
  product: Product;

  @ManyToOne(() => ProductColor, (color) => color.baskets, {
    onDelete: "CASCADE",
  })
  color: ProductColor;

  @ManyToOne(() => ProductSize, (size) => size.baskets, {
    onDelete: "CASCADE",
  })
  size: ProductSize;

  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: "CASCADE",
  })
  discount: DiscountEntity;
}
