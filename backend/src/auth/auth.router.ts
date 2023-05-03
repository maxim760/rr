import { Router } from "express";
import passport from "passport";
import authController from "./auth.controller";

const authRouter = Router()

authRouter.post("/registration", authController.registration)
authRouter.post("/registration/oauth2", authController.registrationOauth2)
authRouter.post("/login", authController.login)
authRouter.post("/logout", authController.logout)
authRouter.get("/refresh", passport.authenticate('jwt-refresh', { session: false }), authController.refresh)
authRouter.get("/me", passport.authenticate('jwt', { session: false }), authController.me)
authRouter.get("/users", passport.authenticate('jwt', { session: false }), authController.getAllUsers)
authRouter.get("/yandex", passport.authenticate('yandex', {session: false}))
authRouter.get("/yandex/callback", passport.authenticate("yandex" as any, {display: "popup", session: false}), authController.oauthCallback)

authRouter.get("/users", passport.authenticate('jwt', { session: false }), authController.getAllUsers)
authRouter.put("/address", passport.authenticate('jwt', { session: false }), authController.updateUserAddress)
authRouter.put("/cash", passport.authenticate('jwt', { session: false }), authController.updateUserCash)
authRouter.put("/contact", passport.authenticate('jwt', { session: false }), authController.updateUserContact)
authRouter.delete("/", passport.authenticate('jwt', { session: false }), authController.deleteUser)

export {authRouter}
