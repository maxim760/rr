import { Address } from "../../address/address.entity";
import { OmitCreateEntity } from "../../core/types";
import { User } from "../../user/user.entity";

export type CreateUserDto = {
  user: OmitCreateEntity<User, "refreshToken" | "cash" | "roles">,
  address: OmitCreateEntity<Address>
}