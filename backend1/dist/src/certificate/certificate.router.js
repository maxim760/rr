"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const certificate_controller_1 = __importDefault(require("./certificate.controller"));
const certificateRouter = (0, express_1.Router)();
exports.certificateRouter = certificateRouter;
certificateRouter.post("/add", passport_1.default.authenticate('jwt', { session: false }), certificate_controller_1.default.addCertificate);
certificateRouter.get("/", passport_1.default.authenticate('jwt', { session: false }), certificate_controller_1.default.getCertificates);
