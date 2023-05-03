import { PassportStatic } from "passport";
import dotenv from "dotenv"
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { User } from "../../user/user.entity";
import authService from "../../auth/auth.service";
dotenv.config()

const applyGoogleStrategy = (passport: PassportStatic) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/${process.env.ROOT_ROUTE}/auth/google/callback`,
    pkce: true,
    state: true,
    scope: ["profile", "email"],
    
  },
  async function (accessToken, refreshToken, profile, done) {
    const user: Partial<User> = {
      firstName: profile.name?.givenName || "",
      lastName: profile.name?.familyName || "",
      email: profile._json.email || ""
    }
    const loginData = await authService.loginAfterOauth(user)
    console.log(loginData)
    return done(null, loginData);
  }));
}

export default applyGoogleStrategy
