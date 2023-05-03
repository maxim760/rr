import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, OneToMany } from "typeorm";
import { Address } from "../address/address.entity";
import { OrderGoods } from "../order/order-goods.entity";
import { Order } from "../order/order.entity";
import { Product } from "../product/product.entity";
import { Role } from "../role/role.entity";

@Entity({name: "goods"})
export class Goods {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name: "good_type", default: ""})
  goodsType: string

  @Column({default: 0})
  discount: number;

  @Column()
  price: number;
  @Column({name: "current_price"})
  currentPrice: number;
  @Column({default: ""})
  name: string;
  @Column({default: ""})
  description: string;
  @Column({default: ""})
  img: string;
  @Column({select: false})
  left: number = 0;

  @ManyToMany(() => Product, {onDelete: "CASCADE"})
  @JoinTable({
    name: "product_goods",
    joinColumn: { name: "goods_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
  })
  products: Product[]

  @ManyToMany(() => Order, order => order.goods)
  orders: Order[];

  @OneToMany(() => OrderGoods, orderGoods => orderGoods.goods)
  ordersToGoods: OrderGoods[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

