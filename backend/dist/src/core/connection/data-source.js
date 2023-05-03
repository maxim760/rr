"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// todo при хостинге уже надо иметь готовую базу со всеми таблицами
// typeorm создвать не будет, так как synchronize false
// для хостинга просто вытащить все таблицы, которые уже созданы
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE,
    url: process.env.DB_CONNECT_URL,
    synchronize: false,
    logging: false,
    entities: [__dirname + '/../../../**/*.entity.js'],
    subscribers: [],
});
