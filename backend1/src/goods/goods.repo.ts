import { AppDataSource } from "../core/connection/data-source";
import { Goods } from "./goods.entity";

export const goodsRepo = AppDataSource.getRepository(Goods)

