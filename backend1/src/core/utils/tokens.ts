import jwt from "jsonwebtoken"
import { IUserPayload } from "../types"

export const TokenService = {
  createAccessToken(payload: IUserPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15m"})
  },
  createRefreshToken(payload: IUserPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "30d"})
  },
  generateTokens(payload: IUserPayload) {
    return {
      accessToken: this.createAccessToken(payload),
      refreshToken: this.createRefreshToken(payload),
    }
  } 
}