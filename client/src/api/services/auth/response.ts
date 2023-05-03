import { IUser, RoleTypes } from "src/api/types/models/User"

export type IUserRegisterResponse = {
  user: {
    email: string
  }
}

export type IUserLoginResponse = {
  user: IUser,
  accessToken: string
}

export type IUserOauthMessage = {
  user: Partial<IUser>,
  accessToken: string,
  finded: false
} | {
  user: IUser,
  accessToken: string,
  finded: true,
  roles: RoleTypes[]
}