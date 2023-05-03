import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity({name: "certificates"})
export class Certificate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.receivedCertificates, {onDelete: "SET NULL", nullable: true})
  @JoinColumn({ name: "from_user" })
  fromUser: User
  
  @ManyToOne(() => User, (user) => user.donatedCertificates, {onDelete: "SET NULL", nullable: true})
  @JoinColumn({ name: "to_user" })
  toUser: User

  @Column({default: 0})
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

