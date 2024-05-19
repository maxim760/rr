import { Router } from "express";
import passport from "passport";
import certificateController from "./certificate.controller";

const certificateRouter = Router()

certificateRouter.post("/add", passport.authenticate('jwt', { session: false }), certificateController.addCertificate)
certificateRouter.get("/", passport.authenticate('jwt', { session: false }), certificateController.getCertificates)

export {certificateRouter}