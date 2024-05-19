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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const address_entity_1 = require("../address/address.entity");
const certificate_entity_1 = require("../certificate/certificate.entity");
const order_entity_1 = require("../order/order.entity");
const role_entity_1 = require("../role/role.entity");
const curier_entity_1 = require("../curier/curier.entity");
const order_service_1 = __importDefault(require("../order/order.service"));
const types_1 = require("../core/types");
let User = class User {
    toJSON() {
        const _a = this, { refreshToken, password } = _a, props = __rest(_a, ["refreshToken", "password"]);
        const test = [
            { latitude: 55.6817, longitude: 37.5154 },
            { latitude: 55.7445, longitude: 37.7184 },
            { latitude: 55.7262, longitude: 37.5611 },
            { latitude: 55.7709, longitude: 37.602 },
            { latitude: 55.7646, longitude: 37.6316 },
        ];
        return Object.assign(Object.assign({}, props), { test: order_service_1.default.findRoute(test.map((item) => ({
                created_at: new Date(),
                curier: {
                    created_at: new Date(),
                    id: '1',
                    name: '1',
                    orders: [],
                    phone: '',
                    route: null,
                    status: types_1.CurierStatus.Busy,
                    updated_at: new Date(),
                    user: {}
                },
                done: false,
                goods: [],
                id: '1',
                orderToGoods: [],
                price: 1,
                status: types_1.OrderStatus.InCurier,
                timestamp: '',
                updated_at: new Date(),
                user: {
                    firstName: 'f',
                    phone: 'ph',
                    address: {
                        full_address: 'full_address',
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }
                },
                withDelivery: true,
            }))) });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "first_name", default: "" }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "last_name", default: "" }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "cash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role, {}),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificate_entity_1.Certificate, (certificate) => certificate.fromUser),
    __metadata("design:type", Array)
], User.prototype, "receivedCertificates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificate_entity_1.Certificate, (certificate) => certificate.toUser),
    __metadata("design:type", Array)
], User.prototype, "donatedCertificates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => address_entity_1.Address, address => address.user),
    __metadata("design:type", address_entity_1.Address)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => curier_entity_1.Curier, curier => curier.user, { nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "curier", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: "users" })
], User);
exports.User = User;
