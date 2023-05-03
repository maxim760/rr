import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../core/types";

@Entity({name: "roles"})
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User
  })
  name: UserRole
}
