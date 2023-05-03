import { PassportStatic } from "passport"
import { userRepo } from "../../user/user.repo"
import applyGithubStrategy from "./github"
import applyGoogleStrategy from "./google"
import applyJwtStrategy from "./jwt"
import applyLocalStrategy from "./local"
import applySlackStrategy from "./slack"
import applyVkStrategy from "./vk"
import applyYandexStrategy from "./yandex"

export const applyStrategies = (passport: PassportStatic) => {
  applyYandexStrategy(passport)
  applySlackStrategy(passport)
  applyGoogleStrategy(passport)
  applyGithubStrategy(passport)
  applyVkStrategy(passport)
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