import { Router } from "express";
import passport from "passport";
import { requireRole } from "../core/middlewares/roleMiddleware";
import { UserRole } from "../core/types";
import goodsController from "./goods.controller";

const goodsRouter = Router()

goodsRouter.get("/", passport.authenticate('jwt', { session: false }), goodsController.getAll)
goodsRouter.post("/create", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), goodsController.create)
goodsRouter.put("/edit/info", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), goodsController.editItem)
goodsRouter.put("/edit/discount", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), goodsController.editDiscount)

export {goodsRouter}