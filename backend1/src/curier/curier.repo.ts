import { AppDataSource } from "../core/connection/data-source";
import { Curier } from "./curier.entity";

export const curierRepo = AppDataSource.getRepository(Curier)

