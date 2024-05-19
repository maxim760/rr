import { NextFunction, Request, Response } from "express";
import { CurierStatus, ITokens, IUserPayload, OmitCreateEntity, TypedRequestBody, TypedRequestParams, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { Product } from "./product.entity";
import { productRepo } from "./product.repo";

class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const result = await productRepo.find({order: {name: "asc"}})
      return res.json({products: result})
    } catch (error) {
      next(error)
    }

  }
  async editItem(req: TypedRequestBody<Product>, res: Response, next: NextFunction) {
    try {
      const {id, name, count} = req.body
      const itemFromDb = await productRepo.findOneByOrFail({ id })
      if (count < 0) {
        return res.status(400).json({ message: 'Нельзя установить кол-во продуктов меньше 0' });
      }
      itemFromDb.name = name;
      itemFromDb.count = count;
      const result = await productRepo.save(itemFromDb);
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }
  async create(req: TypedRequestBody<OmitCreateEntity<Product>>, res: Response, next: NextFunction) {
    try {
      const {name, count} = req.body
      if (count < 0) {
        return res.status(400).json({ message: 'Нельзя установить кол-во продуктов меньше 0' });
      }
      const product = new Product()
      product.name = name
      product.count = count
      product.goods = []
      const result = await productRepo.save(product)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }
}
export default new ProductController