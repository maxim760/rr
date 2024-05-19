import { PassportStatic } from "passport"
import { userRepo } from "../../user/user.repo"
import applyJwtStrategy from "./jwt"
import applyLocalStrategy from "./local"
import applyYandexStrategy from "./yandex"

export const applyStrategies = (passport: PassportStatic) => {
  applyYandexStrategy(passport)
  applyJwtStrategy(passport)
  applyLocalStrategy(passport)

  passport.serializeUser(function (user, done) {
    console.log("serialize")
    done(null, {id: user.id});
  });
  
  passport.deserializeUser(function (id: string, done) {
    console.log("deserializez", id)
    try {
      const user = userRepo.findOneOrFail({where: {id}, relations: {roles: true}})
      done(null, user);
    } catch (e) {
      console.log(e)
      done(e)
    }
  })
}