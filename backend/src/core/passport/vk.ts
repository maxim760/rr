import { PassportStatic } from "passport";
import dotenv from "dotenv"
import { Strategy as VKontakteStrategy, } from 'passport-vkontakte';
import { Strategy as VkStrategy, } from 'passport-vkontakte';
import { User } from "../../user/user.entity";
import authService from "../../auth/auth.service";
dotenv.config()

const applyVkStrategy = (passport: PassportStatic) => {
  passport.use(new VkStrategy({
    clientID: process.env.VK_CLIENT_ID,
    clientSecret: process.env.VK_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/vk/callback`,
    lang: "ru",
    apiVersion: "5.131",
  },
  async  function (accessToken: any, refreshToken: any, params: any, profile: any, done: any, ...all: any[]) {
    const user: Partial<User> = {
      firstName: profile._json?.first_name || "",
      lastName: profile._json?.last_name || "",
      email: profile?.emails?.[0]?.value || "",
    }
    const loginData = await authService.loginAfterOauth(user)
    return done(null, loginData);
  } as any));
}

export default applyVkStrategy
