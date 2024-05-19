import { AxiosRequestConfig } from "axios";
import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { IAddress, IAddressResponse } from "src/api/types/models/Address";
import { IUser } from "src/api/types/models/User";
import { AuthResponse } from "src/api/types/response/AuthResponse";
import { EditUserBalanceDto, EditUserContactDto, FindUsersDto, LoginUserDto, RegisterUserDto } from "./dto";
import { IUserLoginResponse, IUserRegisterResponse } from "./response";

class AuthApi {
  static path(nextPath: string) {
    return "/auth" + nextPath
  }
  async register(dto: RegisterUserDto) {
    const { data } = await api.post<IUserRegisterResponse>(AuthApi.path("/registration"), dto)
    return data
  }
  async registerOauth2(dto: RegisterUserDto) {
    const { data } = await api.post<IUserLoginResponse>(AuthApi.path("/registration/oauth2"), dto)
    return data
  }
  async login(dto: LoginUserDto) {
    const { data } = await api.post<IUserLoginResponse>(AuthApi.path("/login"), dto)
    return data
  }
  async me() {
    const { data } = await api.get<IUser>(AuthApi.path("/me"))
    return data
  }
  async refresh() {
    const { data } = await api.get<AuthResponse>(AuthApi.path("/refresh"), {_isRetry: true} as AxiosRequestConfig)
    return data
  }
  async logout() {
    await api.post(AuthApi.path("/logout"))
  }
  async editAddress(dto: IAddress) {
    const { data } = await api.put<DefaultSuccessResponse>(AuthApi.path("/address"), dto)
    return data
  }
  async editContact(dto: EditUserContactDto) {
    const { data } = await api.put<DefaultSuccessResponse>(AuthApi.path("/contact"), dto)
    return data
  }
  async editBalance(dto: EditUserBalanceDto) {
    const { data } = await api.put<DefaultSuccessResponse>(AuthApi.path("/cash"), dto)
    return data
  }
  async deleteAccount() {
    const { data } = await api.delete<DefaultSuccessResponse>(AuthApi.path(""))
    return data
  }
  async getUsers(dto: FindUsersDto) {
    const { data } = await api.get<Omit<IUser, "roles">[]>(AuthApi.path("/users"), { params: dto })
    return data
  }

}

export const authApi = new AuthApi()