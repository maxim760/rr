"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodsRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const roleMiddleware_1 = require("../core/middlewares/roleMiddleware");
const types_1 = require("../core/types");
const goods_controller_1 = __importDefault(require("./goods.controller"));
const goodsRouter = (0, express_1.Router)();
exports.goodsRouter = goodsRouter;
goodsRouter.get("/", passport_1.default.authenticate('jwt', { session: false }), goods_controller_1.default.getAll);
goodsRouter.post("/create", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), goods_controller_1.default.create);
goodsRouter.put("/edit/info", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), goods_controller_1.default.editItem);
goodsRouter.put("/edit/discount", passport_1.default.authenticate('jwt', { session: false }), (0, roleMiddleware_1.requireRole)(types_1.UserRole.Admin), goods_controller_1.default.editDiscount);
