import { IUser } from "../models/User";

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}

