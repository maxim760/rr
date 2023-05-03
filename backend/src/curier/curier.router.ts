import { Router } from "express";
import passport from "passport";
import { requireRole } from "../core/middlewares/roleMiddleware";
import { UserRole } from "../core/types";
import curierController from "./curier.controller";

const curierRouter = Router()

curierRouter.get("/", passport.authenticate('jwt', { session: false }), curierController.getAll)
curierRouter.put("/edit", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), curierController.editItem)
curierRouter.post("/create", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), curierController.create)
curierRouter.delete("/:curierId", passport.authenticate('jwt', { session: false }), requireRole(UserRole.Admin), curierController.delete)

export {curierRouter}