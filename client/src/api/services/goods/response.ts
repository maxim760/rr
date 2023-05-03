export type IGoodsItem = {
  id: string,
  goodsType: string,
  description: string,
  discount: number,
  price: number,
  currentPrice: number,
  name: string,
  img: string,
}

export type IGoods = IGoodsItem

export type IGoodsResponse = IGoods & {left: number}