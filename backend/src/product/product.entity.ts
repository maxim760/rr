import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, ManyToOne } from "typeorm";
import { Goods } from "../goods/goods.entity";

@Entity({name: "products"})
export class Product {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({default: 0})
  count: number;

  @Column()
  name: string;

  @ManyToMany(() => Goods, { onDelete: "CASCADE" })
  goods: Goods[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}

