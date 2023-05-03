"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../core/types");
const user_repo_1 = require("../user/user.repo");
const typeorm_1 = require("typeorm");
const order_repo_1 = require("./order.repo");
const curier_repo_1 = require("../curier/curier.repo");
const order_entity_1 = require("./order.entity");
const goods_repo_1 = require("../goods/goods.repo");
const order_goods_entity_1 = require("./order-goods.entity");
class OrderController {
    getAll(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, roles } = req.user || {};
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const isAdmin = (roles || []).includes(types_1.UserRole.Admin);
                const orders = yield order_repo_1.orderRepo.find(Object.assign(Object.assign({}, (isAdmin ? {} : { where: { user: { id } } })), { relations: { curier: true, user: true, goods: true, orderToGoods: { goods: true } }, select: { user: { firstName: true, lastName: true, id: true, phone: true, email: true } }, order: { "created_at": "desc" }, relationLoadStrategy: "query" }));
                const totalCost = yield order_repo_1.orderRepo.sum("price", isAdmin ? undefined : { user: { id } });
                return res.json({
                    orders,
                    totalCost
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield user_repo_1.userRepo.findOneByOrFail({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
                const { goods, userId, withDelivery, deliveryCost } = req.body;
                if (!goods.length) {
                    return res.status(400).json({ message: 'Блюд не выбрано' });
                }
                const goodsFromDbUniq = yield goods_repo_1.goodsRepo.find({ where: { id: (0, typeorm_1.In)(goods) }, relations: { products: true } });
                const goodsFromDb = goodsFromDbUniq.flatMap(item => new Array(goods.filter(id => id === item.id).length).fill("").flatMap(() => item));
                let totalPrice = goodsFromDb.reduce((acc, item) => acc + item.currentPrice, 0);
                if (totalPrice === null) {
                    return res.status(400).json({ message: 'Ошибка при вычислении стоимости' });
                }
                const item = new order_entity_1.Order();
                item.done = !withDelivery;
                item.withDelivery = withDelivery;
                item.goods = [];
                item.user = { id: userId };
                if (withDelivery) {
                    totalPrice += deliveryCost;
                    const curiers = yield curier_repo_1.curierRepo.find({ where: { status: types_1.CurierStatus.Free }, relations: { orders: true } });
                    if (!curiers.length) {
                        return res.status(400).json({ message: "Нет свободных курьеров" });
                    }
                    const count = curiers.length;
                    const randomIdx = Math.floor(Math.random() * count);
                    const curier = curiers[randomIdx];
                    curier.status = types_1.CurierStatus.Busy;
                    curier.orders || (curier.orders = []);
                    curier.orders.push(item);
                    item.curier = curier;
                    yield curier_repo_1.curierRepo.save(curier);
                }
                if (totalPrice > currentUser.cash) {
                    return res.status(400).json({ message: "Недостаточно денег на балансе" });
                }
                item.price = totalPrice;
                yield order_repo_1.orderRepo.save(item);
                const orderToGoods = [];
                for (let goods of goodsFromDb) {
                    const orderGoods = new order_goods_entity_1.OrderGoods();
                    orderGoods.goods = { id: goods.id };
                    orderGoods.goods_id = goods.id;
                    orderGoods.order = item;
                    orderGoods.order_id = item.id;
                    orderToGoods.push(orderGoods);
                }
                yield order_repo_1.orderGoodsRepo.save(orderToGoods);
                item.orderToGoods = orderToGoods;
                console.log(orderToGoods.map(item => item.orderToGoodsId));
                currentUser.cash -= totalPrice;
                item.goods = goodsFromDb;
                yield user_repo_1.userRepo.save(currentUser);
                const result = yield order_repo_1.orderRepo.save(item);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    confirmOrder(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "";
                const isAdmin = (((_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) || []).includes(types_1.UserRole.Admin);
                const itemFromDb = yield order_repo_1.orderRepo.findOneOrFail({ where: { id }, relations: { user: true, curier: true }, select: { user: { id: true } } });
                if (((_c = itemFromDb === null || itemFromDb === void 0 ? void 0 : itemFromDb.user) === null || _c === void 0 ? void 0 : _c.id) !== userId && !isAdmin) {
                    return res.status(403).json({ message: "Нет доступа к этой функции" });
                }
                itemFromDb.done = true;
                const curier = itemFromDb.curier;
                if (curier != null) {
                    curier.status = types_1.CurierStatus.Free;
                    console.log("curier", curier);
                    yield curier_repo_1.curierRepo.save(curier);
                }
                yield order_repo_1.orderRepo.save(itemFromDb);
                console.log(itemFromDb);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new OrderController;
