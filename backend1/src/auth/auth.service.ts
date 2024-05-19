import { Response } from "express"
import { TokenService } from "../core/utils/tokens"
import { User } from "../user/user.entity"
import { userRepo } from "../user/user.repo"
import { IAfterLoginData } from "./auth.types"

class AuthService {
  async findByEmail(email: string) {
    const result = await userRepo.findOne({ where: { email }, relations: { roles: true } })
    return result
  }

  async loginAfterOauth(user: Partial<User>): Promise<IAfterLoginData> {
    if (!user.email) {
      return {finded: false, user}
    }
    const candidate = await this.findByEmail(user.email)
    if (!candidate) {
      return {finded: false, user}
    }
    const newTokens = TokenService.generateTokens({ email: candidate.email, id: candidate.id, roles: candidate.roles.map(item => item.name) })
    candidate.refreshToken = newTokens.refreshToken
    await userRepo.save(candidate)
    return {
      finded: true,
      user: candidate,
      tokens: newTokens,
      roles: candidate.roles.map(item => item.name)
    }
  }

  returnProfileFields(user: User) {
    const { password, refreshToken, ...other } = user
    return other
  }
}

export default new AuthService()