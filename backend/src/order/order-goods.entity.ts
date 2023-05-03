import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Goods } from "../goods/goods.entity";
import { Product } from "../product/product.entity";
import { Order } from "./order.entity";

@Entity({ name: 'order_goods', })
export class OrderGoods {
  @PrimaryGeneratedColumn('uuid', {primaryKeyConstraintName: "pk"})
  public orderToGoodsId: string;
  @Column({name: "order_id"})
  public order_id: string
  @Column({name: "goods_id"})
  public goods_id: string
  
  @ManyToOne(() => Order, (order) => order.orderToGoods)
  public order: Order;

  @ManyToOne(() => Goods, (goods) => goods.ordersToGoods)
  public goods: Goods;
}