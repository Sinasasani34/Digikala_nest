import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_address")
export class UserAddressEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  postal_code: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.addressList, {
    onDelete: "CASCADE",
  })
  user: UserEntity;
}
