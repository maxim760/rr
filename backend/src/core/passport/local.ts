import { PassportStatic } from "passport";
import dotenv from "dotenv"
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import { TokenService } from "../utils/tokens";
import { Request } from "express";
import { IUserPayload } from "../types";
import { userRepo } from "../../user/user.repo";
import bcrypt from "bcrypt"


const applyLocalStrategy = (passport: PassportStatic) => {
  passport.use(
    "local",
    new LocalStrategy({ usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        console.log("local strategy")
        const user = await userRepo.findOne({ where: { email }, relations: {roles: true} })
        console.log("local strategy after find")
        if (!user) {
          console.log("not user")
          return done(null, false, { message: 'Пользователь с таким email не найден.' })
        }
        const equalsPassword = await bcrypt.compare(password, user?.password || "")
        if (equalsPassword && !!user?.password) {
          return done(null, user);
        }
        return done(null, false, { message: 'Неправильный пароль.' });
      }
    )
  )
}

export default applyLocalStrategy