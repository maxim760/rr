import { api } from "src/api/host";
import { DefaultSuccessResponse } from "src/api/types/common";
import { CreateGoodsDto, EditGoodsDiscountDto, EditGoodsItemDto, EditGoodsProductsDto, GetGoodsDto } from "./dto";
import { IGoods, IGoodsResponse } from "./response";

class GoodsApi {
  static path(nextPath: string) {
    return "/goods" + nextPath
  }
  async create(dto: CreateGoodsDto) {
    const { data } = await api.post<DefaultSuccessResponse>(GoodsApi.path("/create"), dto)
    return data
  }
  async get(dto: GetGoodsDto) {
    const { data } = await api.get<IGoodsResponse[]>(GoodsApi.path("/"), {params: dto})
    return data
  }
  async editItem(dto: EditGoodsItemDto) {
    const { data } = await api.put<DefaultSuccessResponse>(GoodsApi.path("/edit/info"), dto)
    return data
  }
  async editDiscount(dto: EditGoodsDiscountDto) {
    const { data } = await api.put<DefaultSuccessResponse>(GoodsApi.path("/edit/discount"), dto)
    return data
  }
  async editProducts(dto: EditGoodsProductsDto) {
    const { data } = await api.put<DefaultSuccessResponse>(GoodsApi.path("/edit/products"), dto)
    return data
  }
}

export const goodsApi = new GoodsApi()