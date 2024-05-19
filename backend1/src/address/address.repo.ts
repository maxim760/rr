import { AppDataSource } from "../core/connection/data-source";
import { Address } from "./address.entity";

export const addressRepo = AppDataSource.getRepository(Address)