import { OmitCreateEntity } from "../../core/types";
import { Certificate } from "../certificate.entity";

export type CreateCertificateDto = {
  price: number,
  fromUser: string,
  toUser: string,
}