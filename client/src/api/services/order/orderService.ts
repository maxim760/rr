import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { ConfirOrderDto, CreateOrderDto } from "./dto";
import { IOrderData } from "./response";

class OrderApi {
  static path(nextPath: string) {
    return "/order" + nextPath
  }
  async create(dto: CreateOrderDto) {
    const { data } = await api.post<DefaultSuccessResponse>(OrderApi.path("/create"), dto)
    return data
  }
  async confirm(dto: ConfirOrderDto) {
    const { data } = await api.post<DefaultSuccessResponse>(OrderApi.path("/confirm"), dto)
    return data
  }
  async get() {
    const { data } = await api.get<IOrderData>(OrderApi.path("/"))
    return data
  }
}

export const orderApi = new OrderApi()