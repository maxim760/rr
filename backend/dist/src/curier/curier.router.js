"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.curierRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const roleMiddleware_1 = require("../core/middlewares/roleMiddleware");
const types_1 = require("../core/types");
const curier_controller_1 = __importDefault(require("./curier.controller"));
const curierRouter = (0, express_1.Router)();
exports.curierRouter = curierRouter;
curierRouter.get("/", passport_1.default.authenticate('jwt', { session: false }), curier_controller_1.default.getAll);
curierRouter.put("/edit", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), curier_controller_1.default.editItem);
curierRouter.post("/create", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), curier_controller_1.default.create);
curierRouter.delete("/:curierId", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), curier_controller_1.default.delete);
