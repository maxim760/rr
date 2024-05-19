"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_2 = require("./src/core/passport");
const data_source_1 = require("./src/core/connection/data-source");
const auth_router_1 = require("./src/auth/auth.router");
const order_router_1 = require("./src/order/order.router");
const certificate_router_1 = require("./src/certificate/certificate.router");
const goods_router_1 = require("./src/goods/goods.router");
const curier_router_1 = require("./src/curier/curier.router");
const product_router_1 = require("./src/product/product.router");
process.env.TZ = "UTC";
data_source_1.AppDataSource
    .initialize()
    .then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = connection.createQueryRunner();
    // await queryRunner.query(`
    //   CREATE TRIGGER IF NOT EXISTS order_goods_AFTER_INSERT
    //   AFTER INSERT
    //   ON order_goods
    //   FOR EACH ROW
    //   BEGIN
    //       UPDATE products
    //           INNER JOIN product_goods
    //       ON products.id = product_goods.product_id
    //           INNER JOIN goods
    //           ON goods.id = product_goods.goods_id
    //       SET count = count - 1
    //       WHERE goods.id = new.goods_id;
    //   END;
    // `);
    // await queryRunner.query(`
    //   CREATE TRIGGER IF NOT EXISTS users_AFTER_DELETE
    //   AFTER DELETE
    //   ON users FOR EACH ROW
    //   BEGIN
    //     delete from addresses where userId = old.id;
    //       delete from users_roles_roles where users_roles_roles.usersId = old.id;
    //       delete from orders where orders.userId = old.id;
    //       delete order_goods from order_goods
    //       left join orders
    //       on order_goods.order_id = orders.id
    //       where orders.userId = old.id;
    //   END;
    // `);
    console.log("Data Source has been initialized!");
}))
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
(0, passport_2.applyStrategies)(passport_1.default);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true, }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Hadnling");
    const { message = "Неизвестная ошибка", statusCode = 500 } = err || {};
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message
    });
};
const rootRouter = (0, express_1.Router)();
app.get("/", (req, res) => res.json({ message: "success" }));
rootRouter.use("/auth", auth_router_1.authRouter);
rootRouter.use("/order", order_router_1.orderRouter);
rootRouter.use("/certificate", certificate_router_1.certificateRouter);
rootRouter.use("/goods", goods_router_1.goodsRouter);
rootRouter.use("/curier", curier_router_1.curierRouter);
rootRouter.use("/product", product_router_1.productRouter);
app.use("/api", rootRouter);
app.use(ErrorHandler);
app.listen(8000, () => {
    console.log('Сервер запущен на порту ' + 8000);
});
