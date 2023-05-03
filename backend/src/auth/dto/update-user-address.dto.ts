import { User } from "../../user/user.entity";

export type UpdateUserAddressDto = Omit<User["address"], "id">