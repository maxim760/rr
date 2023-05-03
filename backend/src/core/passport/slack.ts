import { PassportStatic } from "passport";
import dotenv from "dotenv"
import { Strategy as SlackStrategy } from 'passport-slack-oauth2';
import { User } from "../../user/user.entity";
import authService from "../../auth/auth.service";
dotenv.config()

const applySlackStrategy = (passport: PassportStatic) => {
  passport.use("slack", new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/slack/callback`,
    skipUserProfile: false,
    scope: ['identity.basic', 'identity.email', 'identity.avatar'],
    pkce: true,
    state: true,
  },
  async function (accessToken: any, refreshToken: any, profile: any, done: any) {
    const userData = profile?.user || {}
    const user: Partial<User> = {
      firstName: userData?.name || "",
      email: userData?.email || "",
    }
    const loginData = await authService.loginAfterOauth(user)
    return done(null, loginData);
  }));
}

export default applySlackStrategy
