"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const roleMiddleware_1 = require("../core/middlewares/roleMiddleware");
const types_1 = require("../core/types");
const product_controller_1 = __importDefault(require("./product.controller"));
const productRouter = (0, express_1.Router)();
exports.productRouter = productRouter;
productRouter.get("/", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), product_controller_1.default.getAll);
productRouter.put("/edit", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), product_controller_1.default.editItem);
productRouter.post("/create", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), product_controller_1.default.create);
