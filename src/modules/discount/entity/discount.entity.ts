import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DiscountType } from "../enum/type.enum";
import { BasketEntity } from "src/modules/basket/entity/basket.entity";

@Entity()
export class DiscountEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: "decimal", nullable: true })
  percent: number;

  @Column({ type: "decimal", nullable: true })
  amount: number;

  @Column({ nullable: true })
  limit: number;

  // تعداد استفاده شده از کد تخفیف
  @Column({ nullable: true, default: 0 })
  usage: number;

  @Column({ type: "timestamp", nullable: true })
  expires_in: Date;

  @Column({ nullable: true })
  productId: number;

  @Column({ type: "enum", enum: DiscountType })
  type: string;

  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets: BasketEntity[];
}
