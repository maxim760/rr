import { IUser } from "src/api/types/models/User"

export type ICertUser = Pick<IUser, "firstName" | "lastName" | "phone" | "id">

export type ICertificate = {
  id: string,
  fromUser: ICertUser,
  toUser: ICertUser,
  price: number,
  created_at: string,
  updated_at: string
}

export type IUserCertificates = {
  donated: ICertificate[],
  received: ICertificate[]
}

type KeysOfTypeICertUser<T> = {
  [K in keyof T]: T[K] extends ICertUser ? K : never
}[keyof T]

export type CertUserKeys = KeysOfTypeICertUser<ICertificate> 