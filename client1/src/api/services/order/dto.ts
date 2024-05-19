import { IGoods } from "../goods/response";
import { IOrderItem } from "./response";

export type CreateOrderDto = {
  userId: string,
  goods: string[],
  deliveryCost: number
} & Pick<IOrderItem, "withDelivery">

export type ConfirOrderDto = {
  id: string,
}