"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goods = void 0;
const typeorm_1 = require("typeorm");
const order_goods_entity_1 = require("../order/order-goods.entity");
const order_entity_1 = require("../order/order.entity");
const product_entity_1 = require("../product/product.entity");
let Goods = class Goods {
    constructor() {
        this.left = 0;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Goods.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "good_type", default: "" }),
    __metadata("design:type", String)
], Goods.prototype, "goodsType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Goods.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Goods.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "current_price" }),
    __metadata("design:type", Number)
], Goods.prototype, "currentPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Goods.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Goods.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Goods.prototype, "img", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", Number)
], Goods.prototype, "left", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => product_entity_1.Product, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinTable)({
        name: "product_goods",
        joinColumn: { name: "goods_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
    }),
    __metadata("design:type", Array)
], Goods.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => order_entity_1.Order, order => order.goods),
    __metadata("design:type", Array)
], Goods.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_goods_entity_1.OrderGoods, orderGoods => orderGoods.goods),
    __metadata("design:type", Array)
], Goods.prototype, "ordersToGoods", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Goods.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Goods.prototype, "updated_at", void 0);
Goods = __decorate([
    (0, typeorm_1.Entity)({ name: "goods" })
], Goods);
exports.Goods = Goods;
