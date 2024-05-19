import { ICurier } from "src/api/services/curier/response"
import { IAddress, IAddressResponse } from "./Address"
import { IOrderItem } from "src/api/services/order/response"

export enum RoleTypes {
  Admin = "admin",
  User = "user"
}

export type IUser = {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: IAddressResponse,
  cash: number,
  created_at: string,
  updated_at: string,
  roles: {
    id: string,
    name: RoleTypes
  }[]
  curier: ICurier & { user: IUser } & {orders: IOrderItem[]}
}