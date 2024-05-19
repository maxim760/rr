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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../core/types");
const user_repo_1 = require("../user/user.repo");
const typeorm_1 = require("typeorm");
const order_repo_1 = require("./order.repo");
const curier_repo_1 = require("../curier/curier.repo");
const goods_repo_1 = require("../goods/goods.repo");
const order_goods_entity_1 = require("./order-goods.entity");
const order_service_1 = __importDefault(require("./order.service"));
const curierAddress = {
    user: {
        address: {
            longitude: 37.480678,
            latitude: 55.663119,
            full_address: 'проспект Вернадского, 86А'
        },
        firstName: '',
        phone: '',
    },
    price: 0,
    id: '-1',
    status: types_1.OrderStatus.InCurier,
    created_at: new Date(),
    done: false,
    withDelivery: true,
};
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
                const orders = yield order_repo_1.orderRepo.find(Object.assign(Object.assign({}, (isAdmin ? {} : { where: { user: { id } } })), { relations: { curier: { user: true }, user: true, goods: true, orderToGoods: { goods: true } }, select: { user: { firstName: true, lastName: true, id: true, phone: true, email: true }, curier: { user: { firstName: true, lastName: true, id: true, phone: true, email: true } } }, order: { "created_at": "desc" }, relationLoadStrategy: "query" }));
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
                const itemUser = yield user_repo_1.userRepo.findOne({ where: { id: userId }, relations: { address: true } });
                if (!itemUser) {
                    return res.status(400).json({ message: 'Пользователь не найден' });
                }
                const item = order_repo_1.orderRepo.create();
                item.done = !withDelivery;
                item.withDelivery = withDelivery;
                item.goods = [];
                item.user = itemUser;
                item.status = types_1.OrderStatus.Wait;
                item.timestamp = new Date().toISOString();
                if (withDelivery) {
                    totalPrice += deliveryCost;
                }
                if (totalPrice > currentUser.cash) {
                    return res.status(400).json({ message: "Недостаточно денег на балансе" });
                }
                item.price = totalPrice;
                if (withDelivery) {
                    const curiers = yield curier_repo_1.curierRepo.find({ where: { status: types_1.CurierStatus.Free }, relations: { orders: { user: { address: true } } } });
                    if (!curiers.length) {
                        return res.status(400).json({ message: "Нет свободных курьеров" });
                    }
                    const savedItem = yield order_repo_1.orderRepo.save(item);
                    const count = curiers.length;
                    const randomIdx = Math.floor(Math.random() * count);
                    const randomCurier = curiers[randomIdx];
                    const idxCuriesWithOrders = curiers.findIndex((c) => c.orders.filter(o => !o.done));
                    const curier = idxCuriesWithOrders === -1 ? randomCurier : curiers[idxCuriesWithOrders];
                    curier.orders || (curier.orders = []);
                    curier.orders.push(item);
                    item.curier = curier;
                    yield curier_repo_1.curierRepo.save(curier);
                    console.log("save");
                    console.log(curier.orders.filter(o => o.status === types_1.OrderStatus.Wait));
                    console.log(curier.orders.filter(o => o.status === types_1.OrderStatus.Wait).length, 'lenght');
                    if (curier.orders.filter(o => o.status === types_1.OrderStatus.Wait).length >= 5) {
                        console.log("in if");
                        for (let i = 0; i < curier.orders.length; i++) {
                            const order = curier.orders[i];
                            if (order.status === types_1.OrderStatus.Wait) {
                                order.status = types_1.OrderStatus.InCurier;
                                yield order_repo_1.orderRepo.save(order);
                            }
                        }
                        curier.status = types_1.CurierStatus.Busy;
                        curier.route = order_service_1.default.findRoute(curier.orders.filter(o => o.status === types_1.OrderStatus.InCurier || item.id === o.id).map((i) => i.id === item.id ? savedItem : i), curierAddress);
                        console.log(curier.route);
                        yield curier_repo_1.curierRepo.save(curier);
                    }
                    else {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            try {
                                const sameCurier = yield curier_repo_1.curierRepo.findOne({ where: { id: curier.id }, relations: { orders: { user: { address: true } } } });
                                if ((sameCurier === null || sameCurier === void 0 ? void 0 : sameCurier.status) === types_1.CurierStatus.Free && ((_b = sameCurier.orders.find(o => o.timestamp && o.timestamp === item.timestamp)) === null || _b === void 0 ? void 0 : _b.status) === types_1.OrderStatus.Wait) {
                                    for (let i = 0; i < curier.orders.length; i++) {
                                        const order = curier.orders[i];
                                        if (order.status === types_1.OrderStatus.Wait) {
                                            order.status = types_1.OrderStatus.InCurier;
                                            yield order_repo_1.orderRepo.save(order);
                                        }
                                    }
                                    curier.status = types_1.CurierStatus.Busy;
                                    curier.route = order_service_1.default.findRoute(curier.orders.filter(o => o.status === types_1.OrderStatus.InCurier || item.id === o.id), curierAddress);
                                    yield curier_repo_1.curierRepo.save(curier);
                                }
                            }
                            catch (_c) {
                                console.log("timer error");
                            }
                        }), 1000 * 60 * 15);
                    }
                }
                yield order_repo_1.orderRepo.save(item);
                const orderToGoods = [];
                for (let goods of goodsFromDb) {
                    const orderGoods = new order_goods_entity_1.OrderGoods();
                    orderGoods.goods = goods;
                    orderGoods.goodsId = goods.id;
                    orderGoods.order = item;
                    orderGoods.orderId = item.id;
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
    // todo при конфирме делать invalidate для me запроса
    confirmOrder(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "";
                const isAdmin = (((_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) || []).includes(types_1.UserRole.Admin);
                const itemFromDb = yield order_repo_1.orderRepo.findOneOrFail({ where: { id }, relations: { user: true, curier: { user: { address: true }, orders: true } } });
                itemFromDb.done = true;
                itemFromDb.status = types_1.OrderStatus.Finished;
                const curier = itemFromDb.curier;
                if (curier != null && curier.orders.every(order => order.id === itemFromDb.id || order.status !== types_1.OrderStatus.InCurier)) {
                    curier.status = types_1.CurierStatus.Free;
                    curier.route = null;
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
