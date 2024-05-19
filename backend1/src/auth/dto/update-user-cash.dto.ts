import { Address } from "../../address/address.entity";
import { OmitCreateEntity } from "../../core/types";
import { User } from "../../user/user.entity";

export type UpdateUserCashDto = {
  cash: Number,
}