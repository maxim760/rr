import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, OneToMany } from "typeorm";
import { Address } from "../address/address.entity";
import { Certificate } from "../certificate/certificate.entity";
import { Order } from "../order/order.entity";
import { Role } from "../role/role.entity";
import { Curier } from "../curier/curier.entity";
import orderService from "../order/order.service";
import { CurierStatus, OrderStatus } from "../core/types";

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

  @OneToOne(() => Curier, curier => curier.user, { nullable: true })
  curier: Curier | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toJSON() {
    const { refreshToken, password, ...props } = this
    const test = [
      {latitude: 55.6817, longitude: 37.5154},
      {latitude: 55.7445, longitude: 37.7184},
      {latitude: 55.7262, longitude: 37.5611},
      {latitude: 55.7709, longitude: 37.602},
      {latitude: 55.7646, longitude: 37.6316},
    ]
    return {
      ...props,
      test: orderService.findRoute(test.map((item): Order => (
        {
          created_at: new Date(),
          curier: {
            created_at: new Date(),
            id: '1',
            name: '1',
            orders: [],
            phone: '',
            route: null,
            status: CurierStatus.Busy,
            updated_at: new Date(),
            user: {} as User
          },
          done: false,
          goods: [],
          id: '1',
          orderToGoods: [],
          price: 1,
          status: OrderStatus.InCurier,
          timestamp: '',
          updated_at: new Date(),
          user: {
            firstName: 'f',
            phone: 'ph',
            address: {
              full_address: 'full_address',
              latitude: item.latitude,
              longitude: item.longitude,
            } as Address
          } as User,
          withDelivery: true,
        }
      )))
    }
  }
}

