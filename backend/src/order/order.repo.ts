import { AppDataSource } from "../core/connection/data-source";
import { OrderGoods } from "./order-goods.entity";
import { Order } from "./order.entity";

export const orderRepo = AppDataSource.getRepository(Order)
export const orderGoodsRepo = AppDataSource.getRepository(OrderGoods)

