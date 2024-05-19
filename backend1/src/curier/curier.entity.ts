import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, OneToMany } from "typeorm";
import { Address } from "../address/address.entity";
import { CurierStatus, Route, RouteData } from "../core/types";
import { Order } from "../order/order.entity";
import { Product } from "../product/product.entity";
import { Role } from "../role/role.entity";
import { User } from "../user/user.entity";

@Entity({name: "curiers"})
export class Curier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => Order, (order: Order) => order.curier)
  orders: Order[];

  @OneToOne(() => User, (user) => user.curier, {onDelete: "CASCADE"})
  @JoinColumn()
  user: User

  @Column({
    type: "enum",
    enum: CurierStatus,
    default: CurierStatus.Free
  })
  status: CurierStatus;

  @Column("json", { nullable: true })
  route: RouteData | null;
  @Column()
  name: string;
  @Column()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

