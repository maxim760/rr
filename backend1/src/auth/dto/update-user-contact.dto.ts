import { User } from "../../user/user.entity";

export type UpdateUserContantDto = Pick<User, "firstName" | "lastName" | "phone">