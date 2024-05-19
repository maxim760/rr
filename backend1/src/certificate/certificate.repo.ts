import { AppDataSource } from "../core/connection/data-source";
import { Certificate } from "./certificate.entity";

export const certificateRepo = AppDataSource.getRepository(Certificate)

