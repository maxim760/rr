import { Router } from "express";
import passport from "passport";
import { requireRole } from "../core/middlewares/roleMiddleware";
import { UserRole } from "../core/types";
import productController from "./product.controller";

const productRouter = Router()

productRouter.get("/", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), productController.getAll)
productRouter.put("/edit", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), productController.editItem)
productRouter.post("/create", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), productController.create)

export {productRouter}