"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const order_controller_1 = __importDefault(require("./order.controller"));
const orderRouter = (0, express_1.Router)();
exports.orderRouter = orderRouter;
orderRouter.get("/", passport_1.default.authenticate('jwt', { session: false }), order_controller_1.default.getAll);
orderRouter.post("/create", passport_1.default.authenticate('jwt', { session: false }), order_controller_1.default.create);
orderRouter.post("/confirm", passport_1.default.authenticate('jwt', { session: false }), order_controller_1.default.confirmOrder);
