import { User } from "../../user/user.entity";

export type LoginUserDto = Pick<User, "email" | "password">