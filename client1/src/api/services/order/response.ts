import { IUser } from "src/api/types/models/User"
import { ICurier } from "../curier/response"
import { IGoods, IGoodsItem } from "../goods/response"

export type IOrderUser = Pick<IUser, "firstName" | "lastName" | "id" | "phone" | "email" | 'address'>

export enum OrderStatus {
  Wait = "Wait",
  InCurier = "InCurier",
  Finished = "Finished",
}
export type IOrderItem = {
  id: string,
  user: IOrderUser,
  goods: IGoodsItem[],
  withDelivery: boolean,
  price: number,
  done: boolean,
  status: OrderStatus,
  curier: (ICurier & { user: IUser }) | null,
  created_at: string;
}


export type IOrderData = {
  orders: IOrderItem[],
  totalCost: number,
}