import { NextFunction, Request, Response } from "express";
import { CurierStatus, ITokens, IUserPayload, OmitCreateEntity, TypedRequestBody, TypedRequestParams, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { Curier } from "./curier.entity";
import { curierRepo } from "./curier.repo";
import authService from "../auth/auth.service";
import { Address } from "../address/address.entity";
import bcrypt from "bcrypt"
import { addressRepo } from "../address/address.repo";

async function createUser(opts: {firstName: string, lastName: string, phone: string, email: string, password: string }): Promise<{ user: User } | { message: string }> {
  try {
    const { email, firstName, lastName, password, phone } = opts;
    const userWithEmail = await userRepo.findOneBy({ email: email })
    if (userWithEmail) {
      return {message: "Пользователь с таким email уже существует"}
    }
    console.log({email, firstName, lastName, phone})
    const user = userRepo.create({ firstName, lastName, phone, email })
    user.cash = 0

    const roles: Role[] = []
    let userRole = await roleRepo.findOneBy({ name: UserRole.User });
    if (!userRole) {
      userRole = roleRepo.create({ name: UserRole.User })
      await roleRepo.save(userRole)
    }
    roles.push(userRole)
    user.roles = roles
    if (!password) {
      return {message: "Укажите пароль"}
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt)
      user.password = hashedPass
    }

    const address = addressRepo.create(curierAddress)
    await addressRepo.save(address)
    user.address = address
    await userRepo.save(user)
  
    return {user};
  } catch (e) {
    return { message: 'Неизвестная ошибка' }
  }
}

const curierAddress: OmitCreateEntity<Address, 'user'> = {
  city: 'Москва',
  commentary: '',
  country: 'Россия',
  entrance: '1',
  flat: 1,
  house: '11',
  latitude: 55.68171,
  longitude: 37.51540,
  street: 'Проспект Вернадского',
  full_address: 'Москва, Проспект Вернадского, 1, 11',
}

class CurierController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const result = await curierRepo.find({ relations: { user: true } })
      return res.json(result)
    } catch (error) {
      next(error)
    }

  }
  async editItem(req: TypedRequestBody<{ id: string, firstName: string, lastName: string, phone: string, status: CurierStatus }>, res: Response, next: NextFunction) {
    try {
      const { id, firstName, lastName, phone, status } = req.body
      if (!status) {
        return res.status(400).json({message: "Статус не указан"})
      }
      const curierItemFromDb = await curierRepo.findOneOrFail({ where: { id }, relations: { user: true } });
      curierItemFromDb.user.firstName = firstName
      curierItemFromDb.user.lastName = lastName
      curierItemFromDb.user.phone = phone;
      curierItemFromDb.status = status;
      await userRepo.save(curierItemFromDb.user);
      const result = await curierRepo.save(curierItemFromDb);
      return res.json({data: true})
    } catch (error) {
      next(error)
    }

  }

  async create(req: TypedRequestBody<OmitCreateEntity<{ id: string, firstName: string, lastName: string, phone: string,  email: string, password: string }>>, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const createUserRes = await createUser(userData)
      if ('message' in createUserRes) {
        console.log('1')
        return res.status(400).json({message: createUserRes.message})
      }
      console.log('2')
      const user = createUserRes.user;
      const curier = curierRepo.create({ status:CurierStatus.Free, orders: [], name: '', phone: ''})
      console.log('3')
      await curierRepo.save(curier);
      console.log('4')
      user.curier = curier;
      await userRepo.save(user);  
      console.log('5')

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