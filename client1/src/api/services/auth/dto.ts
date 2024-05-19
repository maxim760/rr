import { IAddress } from "src/api/types/models/Address";
import { IUser } from "src/api/types/models/User";

export type RegisterUserDto = {
  user: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string | null,
  },
  address: IAddress
}

export type LoginUserDto = {
  email: string,
  password: string
}

export type EditUserContactDto = Pick<IUser, "firstName" | "lastName" | "phone">

export type EditUserBalanceDto = Pick<IUser, "cash">

export type FindUsersDto = {query: string}