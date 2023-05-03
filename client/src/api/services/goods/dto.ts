import { IGoods } from "./response"

export type GetGoodsDto = {
  min: number,
  max: number,
  query: string
}

export type CreateGoodsDto = Pick<IGoods, "name" | "price" | "goodsType" | "img" | "description">
export type EditGoodsItemDto = Pick<IGoods, "id" | "name" | "price" | "goodsType" | "img" | "description">
export type EditGoodsDiscountDto = Pick<IGoods, "id" | "discount">