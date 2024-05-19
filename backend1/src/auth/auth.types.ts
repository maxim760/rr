import { UserRole } from "../core/types";
import { User } from "../user/user.entity";

export type IAfterLoginData =
  {finded: false, user: Partial<User>} |
  {finded: true, user: User, tokens: {accessToken: string, refreshToken: string}, roles: UserRole[]}
  