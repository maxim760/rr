import { AppDataSource } from "../core/connection/data-source";
import { User } from "./user.entity";

export const userRepo = AppDataSource.getRepository(User)

