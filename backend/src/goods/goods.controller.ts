import { NextFunction, Request, Response } from "express";
import { CurierStatus, ITokens, IUserPayload, OmitCreateEntity, TypedRequestBody, TypedRequestParams, TypedRequestQuery, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { goodsRepo } from "./goods.repo";
import {And, ILike, MoreThanOrEqual, LessThanOrEqual, Brackets} from "typeorm"
import { Goods } from "./goods.entity";
import { Product } from "../product/product.entity";

class GoodsController {
  async getAll(req: TypedRequestQuery<{min: number, max: number, query: string}>, res: Response, next: NextFunction) {
    try {
      const {max = 0, min = 0, query = ""} = req.query
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const data = await goodsRepo
        .createQueryBuilder("goods")
        .leftJoinAndSelect("goods.products", "products")
        .leftJoin("product_goods", "pg", "pg.goods_id = goods.id")
        .leftJoin("products", "product", "product.id = pg.product_id")
        .where([
          {name: ILike(`%${query}%`)},
          {description: ILike(`%${query}%`)},
        ])
        .andWhere("goods.currentPrice >= :min", {min: Math.max(0, min)})
        .andWhere(
          new Brackets(qb => {
            qb.where("goods.currentPrice <= :max", { max: Math.max(0, max) })
              .orWhere("0 = :max", {max: Math.max(0, max)});
          })
        )
        .andWhere("pg.goods_id = goods.id")
        .addSelect(subQuery =>
          subQuery.select("MIN(product.count)", "left")
            .from("product_goods", "pg")
            .leftJoin("products", "product", "product.id = pg.product_id")
            .where("pg.goods_id = goods.id")
          , "goods_left")
        .getMany()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  } 
  async editItem(req: TypedRequestBody<Goods>, res: Response, next: NextFunction) {
    try {
      const { id, name, description, price, img, goodsType } = req.body
      if (price <= 0) {
        return res.status(400).json({ message: 'Нельзя установить цену меньше или равную 0' });
      }
      const itemFromDb = await goodsRepo.findOneByOrFail({ id })
      itemFromDb.name = name;
      itemFromDb.description = description;
      itemFromDb.goodsType = goodsType;
      itemFromDb.img = img;
      itemFromDb.price = price;
      itemFromDb.currentPrice = Math.ceil(price * (100 - itemFromDb.discount) / 100);
      const result = await goodsRepo.save(itemFromDb);
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }
  async create(req: TypedRequestBody<OmitCreateEntity<Goods>>, res: Response, next: NextFunction) {
    try {
      const {name, price, description, img, goodsType, products} = req.body
      if (price <= 0) {
        return res.status(400).json({ message: 'Нельзя установить кол-во цену меньше или равную 0' });
      }
      const item = new Goods()
      item.name = name
      item.price = price
      item.currentPrice = price
      item.discount = 0
      item.goodsType = goodsType
      item.img = img
      item.description = description
      const result = await goodsRepo.save(item)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }
  async editDiscount(req: TypedRequestBody<{ discount: number, id: string }>, res: Response, next: NextFunction) {
    try {
      const {discount, id} = req.body
      if (discount < 0 || discount >= 100) {
        return res.status(400).json({ message: 'Некорректный процент скидки' });
      }
      const itemFromDb = await goodsRepo.findOneByOrFail({ id })
      itemFromDb.discount = discount;
      itemFromDb.currentPrice = Math.ceil(itemFromDb.price * (100 - itemFromDb.discount) / 100);;
      const result = await goodsRepo.save(itemFromDb);
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }
}
export default new GoodsController