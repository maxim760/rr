import { AppDataSource } from "../core/connection/data-source";
import { Role } from "./role.entity";

export const roleRepo = AppDataSource.getRepository(Role)