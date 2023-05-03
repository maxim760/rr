import { NextFunction, Request, Response } from "express";
import { FindOptionsRelations, FindOptionsSelect } from "typeorm";
import { ITokens, IUserPayload, TypedRequestBody, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { Certificate } from "./certificate.entity";
import { certificateRepo } from "./certificate.repo";
import { CreateCertificateDto } from "./dto/create-certificate.dto";

class CertificateController {
  async getCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const userSelect: FindOptionsSelect<User> = {
        lastName: true,
        firstName: true,
        phone: true,
        id: true
      }
      const received = await certificateRepo.find({
        where: { toUser: { id: req.user.id }},
        relations: { fromUser: true, toUser: true },
        select: { fromUser: userSelect, toUser: userSelect },
        order: {created_at: "desc"}
      })
      const donated = await certificateRepo.find({
        where: { fromUser: { id: req.user.id }},
        relations: { fromUser: true, toUser: true },
        select: { fromUser: userSelect, toUser: userSelect },
        order: {created_at: "desc"}
  
      })
      return res.json({
        received,
        donated
      })
    } catch (error) {
      next(error)
    }
  }
  async addCertificate(req: TypedRequestBody<CreateCertificateDto>, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id
      const { fromUser, toUser, price } = req.body
      const toUserDb = await userRepo.findOneByOrFail({id: toUser})
      const fromUserDb = await userRepo.findOneByOrFail({id: fromUser})
      if (id !== req.body.fromUser) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      if (price <= 0) {
        return res.status(400).json({data: null, message: "Сумма должна быть больше 0"})
      }
      if (fromUserDb?.cash < price) {
        return res.status(400).json({data: null, message: "Недостаточно денег на балансе"})
      }
      if (fromUserDb.id !== toUserDb.id) {
        fromUserDb.cash -= price
        toUserDb.cash += price
        await userRepo.save(fromUserDb)
        await userRepo.save(toUserDb)
      }
      const certificate = new Certificate();
      certificate.price = price
      certificate.fromUser = {id: fromUser} as User
      certificate.toUser = { id: toUser } as User
      const result = await certificateRepo.save(certificate)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }
}
export default new CertificateController