import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, OneToMany } from "typeorm";
import { Address } from "../address/address.entity";
import { Certificate } from "../certificate/certificate.entity";
import { Order } from "../order/order.entity";
import { Role } from "../role/role.entity";

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name: "first_name", default: ""})
  firstName: string

  @Column({name: "last_name", default: ""})
  lastName: string

  @Column({unique: true, nullable: false})
  email: string

  @Column()
  password: string

  @Column({default: ""})
  phone: string

  @Column({default: 0})
  cash: number

  @Column({ default: "" })
  refreshToken: string;

  @ManyToMany(() => Role, {})
  @JoinTable()
  roles: Role[]


  // полученные сертификаты
  @OneToMany(() => Certificate, (certificate: Certificate) => certificate.fromUser)
  receivedCertificates: Certificate[]
  // подаренные сертификаты
  @OneToMany(() => Certificate, (certificate: Certificate) => certificate.toUser)
  donatedCertificates: Certificate[];

  @OneToMany(() => Order, (order: Order) => order.user)
  orders: Order[]

  @OneToOne(() => Address, address => address.user)
  address: Address

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toJSON() {
    const { refreshToken, password, ...props } = this
    return props
  }
}

