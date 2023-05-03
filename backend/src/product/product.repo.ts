import { AppDataSource } from "../core/connection/data-source";
import { Product } from "./product.entity";

export const productRepo = AppDataSource.getRepository(Product)

