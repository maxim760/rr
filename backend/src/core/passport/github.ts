import { PassportStatic } from "passport";
import dotenv from "dotenv"
import {Profile, Strategy as GithubStrategy} from 'passport-github2';
import { User } from "../../user/user.entity";
import authService from "../../auth/auth.service";
dotenv.config()

const applyGithubStrategy = (passport: PassportStatic) => {
  passport.use("github", new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/github/callback`,
    scope: ["user:email", "read:user"],
    pkce: true,
    // @ts-ignore
    state: true,
  },
  async function (accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    
    // const json = profile?._json || {}
    const user: Partial<User> = {
      firstName: profile?.displayName || "",
      email: profile.emails?.[0].value || "",
    }
    const loginData = await authService.loginAfterOauth(user)
    return done(null, loginData);
  }));
}

export default applyGithubStrategy
