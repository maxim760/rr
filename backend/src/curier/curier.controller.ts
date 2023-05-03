import { NextFunction, Request, Response } from "express";
import { CurierStatus, ITokens, IUserPayload, OmitCreateEntity, TypedRequestBody, TypedRequestParams, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { Curier } from "./curier.entity";
import { curierRepo } from "./curier.repo";

class CurierController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const result = await curierRepo.find()
      return res.json(result)
    } catch (error) {
      next(error)
    }

  }
  async editItem(req: TypedRequestBody<Curier>, res: Response, next: NextFunction) {
    try {
      const { id, name, phone, status } = req.body
      if (!status) {
        return res.status(400).json({message: "Статус не указан"})
      }
      const curierItemFromDb = await curierRepo.findOneByOrFail({id})
      curierItemFromDb.name = name;
      curierItemFromDb.phone = phone;
      curierItemFromDb.status = status
      const result = await curierRepo.save(curierItemFromDb);
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }
  async create(req: TypedRequestBody<OmitCreateEntity<Curier>>, res: Response, next: NextFunction) {
    try {
      const {name, phone} = req.body
      const curier = new Curier()
      curier.name = name
      curier.phone = phone
      curier.status = CurierStatus.Free
      curier.orders = []
      const result = await curierRepo.save(curier)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }

  async delete(req: TypedRequestParams<{curierId: string}>, res: Response, next: NextFunction) {
    try {
      const { curierId } = req.params;
      const curier = await curierRepo.findOneByOrFail({ id: curierId });
      if (curier.status !== CurierStatus.Free) {
        return res.status(409).json({ message: 'Курьер несет заказ, его нельзя удалить' });
      }
      await curierRepo.delete({id: curierId});
      return res.status(200).json({data: true})
    } catch (error) {
      next(error)
    }
  }
}
export default new CurierController