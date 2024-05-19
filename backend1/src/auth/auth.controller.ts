import { NextFunction, Request, Response } from "express";
import { ITokens, IUserPayload, TypedRequestBody, TypedRequestQuery, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from "bcrypt"
import {Like, Raw, ILike} from "typeorm"
import { addressRepo } from "../address/address.repo";
import { LoginUserDto } from "./dto/login-user.dto";
import passport from "passport";
import { TokenService } from "../core/utils/tokens";
import { UpdateUserCashDto } from "./dto/update-user-cash.dto";
import { UpdateUserContantDto } from "./dto/update-user-contact.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { FindUsersDto } from "./dto/find-users-dto";
import cookie from "cookie"

class AuthController {
  async registration(req: TypedRequestBody<CreateUserDto>, res: Response) {
    try {
      const { user: { password, ...userData }, address: addressBody } = req.body;
      const userWithEmail = await userRepo.findOneBy({ email: userData.email })
      if (userWithEmail) {
        return res.status(500).json({message: "Пользователь с таким email уже существует"})
      }
      const user = userRepo.create(userData)
      user.cash = 0

      const roles: Role[] = []
      let userRole = await roleRepo.findOneBy({ name: UserRole.User });
      if (!userRole) {
        userRole = roleRepo.create({ name: UserRole.User })
        await roleRepo.save(userRole)
      }
      roles.push(userRole)
      if (userData.email.includes("@admin")) {
        let adminRole = await roleRepo.findOneBy({ name: UserRole.Admin });
        if (!adminRole) {
          adminRole = roleRepo.create({ name: UserRole.Admin })
          await roleRepo.save(adminRole)
        }
        roles.push(adminRole)
      }
      user.roles = roles
      if (!password) {
        user.password = ""
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        user.password = hashedPass
      }

      const address = addressRepo.create(addressBody)
      await addressRepo.save(address)
      user.address = address
      await userRepo.save(user)
    
      return res.json({ user: {email: user.email} });
    } catch (e) {
      return res.status(500).json({ message: 'Не удалось создать пользователя.' })
    }
  }
  async registrationOauth2(req: TypedRequestBody<CreateUserDto>, res: Response) {
    try {
      const { user: { password, ...userData }, address: addressBody } = req.body;
      const userWithEmail = await userRepo.findOneBy({ email: userData.email })
      if (userWithEmail) {
        return res.status(500).json({message: "Пользователь с таким email уже существует"})
      }
      const user = userRepo.create(userData)
      user.cash = 0

      const roles: Role[] = []
      let userRole = await roleRepo.findOneBy({ name: UserRole.User });
      if (!userRole) {
        userRole = roleRepo.create({ name: UserRole.User })
        await roleRepo.save(userRole)
      }
      roles.push(userRole)
      if (userData.email.includes("@admin")) {
        let adminRole = await roleRepo.findOneBy({ name: UserRole.Admin });
        if (!adminRole) {
          adminRole = roleRepo.create({ name: UserRole.Admin })
          await roleRepo.save(adminRole)
        }
        roles.push(adminRole)
      }
      user.roles = roles
      if (!password) {
        user.password = ""
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        user.password = hashedPass
      }

      const address = addressRepo.create(addressBody)
      await addressRepo.save(address)
      user.address = address
      await userRepo.save(user)
      const payload: IUserPayload = { id: user.id, email: user.email, roles: user.roles.map(item => item.name) };
      const newTokens = TokenService.generateTokens(payload)
      user.refreshToken = newTokens.refreshToken
      await userRepo.save(user)
      console.log("set new cookie", newTokens.refreshToken)
      res.setHeader("Set-Cookie", cookie.serialize("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
      }))
      return res.json({ user: user.toJSON() });
    } catch (e) {
      return res.status(500).json({ message: 'Не удалось создать пользователя.' })
    }
  }

  async login(req: TypedRequestBody<LoginUserDto>, res: Response, next: NextFunction) {
    console.log("try login")
    try {
      passport.authenticate('local', async (err, user: User, info) => {
        console.log()
        if (err || !user) {
          return res.status(401).json({ message: 'Неправильные email или пароль.', login: true });
        }
        const payload: IUserPayload = { id: user.id, email: user.email, roles: user.roles.map(item => item.name) };
        const newTokens = TokenService.generateTokens(payload)
        user.refreshToken = newTokens.refreshToken
        await userRepo.save(user)
        console.log("set new cookie login", newTokens.refreshToken)
        res.setHeader("Set-Cookie", cookie.serialize("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/'
        }))
        return res.json({ user: user.toJSON(), accessToken: newTokens.accessToken });
      })(req, res, next);
    } catch (e) {
      console.log("catch login")
      return res.status(500).json({message: "Ошибка авторизации"})
    }

  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshToken", {
        sameSite: 'none',
        secure: true,
      });
      const user = await userRepo.findOneBy({ id: req.user?.id || "" })
      if (user) {
        user.refreshToken = ""
        await userRepo.save(user)
      }
      res.json({success: true})
    } catch (e) {
      // next(e)
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.user as { tokens: ITokens, user: User }
      res.json({user: data?.user?.toJSON?.(), accessToken: data.tokens.accessToken})
    } catch (e) {
      next(e)
    }
  }

  async oauthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("oauth starts", req.user)
      if ((req.user as any)?.tokens) {
        console.log("set cookies")
        console.log("set new cookie", (req.user as any).tokens.refreshToken)
        res.setHeader("Set-Cookie", cookie.serialize("refreshToken", (req.user as any).tokens.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/'
        }))
      }
      
      res.send(`
        <script>
          window.opener.postMessage(${JSON.stringify({ user: {...req.user, accessToken: req.user?.tokens?.accessToken || "", tokens: null }, type: "oauth2" })}, '*');
          window.close();
        </script>
      `);
    } catch (e) {
      next(e)
    }
  }
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({data: null})
      }
      const user = await userRepo.findOne({ where: { email: req.user.email }, relations: { address: true, roles: true, curier: { orders: { user: { address: true } }, user: true } } })
      if (!user) {
        return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      res.json(user.toJSON())
    } catch (error) {
      next(error)
    }
  }
  async updateUserCash(req: TypedRequestBody<UpdateUserCashDto>, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id
      const user = await userRepo.findOneBy({ id })
      if (!user) {
        return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      await userRepo.update({ id }, { cash: () => `cash + ${req.body.cash}` })
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }
  async updateUserContact(req: TypedRequestBody<UpdateUserContantDto>, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id
      const user = await userRepo.findOneBy({ id })
      if (!user) {
        res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      await userRepo.update({ id }, req.body)
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }
  async updateUserAddress(req: TypedRequestBody<UpdateUserAddressDto>, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id
      const user = await userRepo.findOne({ where: { id }, relations: {address: true}})
      if (!user) {
        return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      
      if (!req.body.full_address || !req.body.longitude || !req.body.latitude) {
        return res.status(400).json({data: null, message: "Адрес не заполнен"})
      }
      const result = await addressRepo.update({ id: user.address.id }, {...user?.address, ...req.body})
      return res.json({data: true})
    } catch (error) {
      next(error)
    }
  }

  async getAllUsers(req: TypedRequestQuery<FindUsersDto>, res: Response, next: NextFunction) {
    try {
      const {query = ""} = req.query
      const users = await userRepo.find({
        where: [
          {firstName: ILike(`%${query}%`)},
          {lastName: ILike(`%${query}%`)},
          {phone: ILike(`%${query}%`)},
        ]
      })
      if (!users) {
        return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      return res.json(users.map(user => user.toJSON()))
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshToken", {
        sameSite: 'none',
        secure: true,
      });
      const id = req.user?.id
      const user = await userRepo.findOne({ where: { id }})
      if (!user) {
        return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
      }
      console.log({id})
      await userRepo.delete({id})
      res.json({ data: 1 })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

}
export default new AuthController