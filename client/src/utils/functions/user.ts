import { IUser, RoleTypes } from "src/api/types/models/User";

export const getPrintRole = (roles: IUser["roles"]) => {
  if (roles.some(item => item.name === RoleTypes.Admin)) {
    return "Администратор"
  }
  return "Пользователь"
}