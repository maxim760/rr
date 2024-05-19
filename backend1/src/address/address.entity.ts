import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity({name: "addresses"})
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.address, {onDelete: "CASCADE"})
  @JoinColumn()
  user: User

  @Column()
  country: string

  @Column()
  city: string

  @Column()
  street: string

  @Column()
  house: string

  @Column()
  entrance: string

  @Column()
  flat: number

  @Column('float')
  latitude: number

  @Column('float')
  longitude: number

  @Column('text')
  full_address: string

  @Column({default: ""})
  commentary: string
}
