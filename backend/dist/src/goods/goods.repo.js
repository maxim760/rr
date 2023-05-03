"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodsRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const goods_entity_1 = require("./goods.entity");
exports.goodsRepo = data_source_1.AppDataSource.getRepository(goods_entity_1.Goods);
