import { Router } from "express";
import passport from "passport";
import { requireRole } from "../core/middlewares/roleMiddleware";
import { UserRole } from "../core/types";
import orderController from "./order.controller";

const orderRouter = Router()

orderRouter.get("/", passport.authenticate('jwt', { session: false }), orderController.getAll)
orderRouter.post("/create", passport.authenticate('jwt', { session: false }), orderController.create)
orderRouter.post("/confirm", passport.authenticate('jwt', { session: false }), orderController.confirmOrder)

export {orderRouter}