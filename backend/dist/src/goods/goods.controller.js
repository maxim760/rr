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
const goods_repo_1 = require("./goods.repo");
const typeorm_1 = require("typeorm");
const goods_entity_1 = require("./goods.entity");
class GoodsController {
    getAll(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { max = 0, min = 0, query = "" } = req.query;
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const data = yield goods_repo_1.goodsRepo
                    .createQueryBuilder("goods")
                    .leftJoinAndSelect("goods.products", "products")
                    .leftJoin("product_goods", "pg", "pg.goods_id = goods.id")
                    .leftJoin("products", "product", "product.id = pg.product_id")
                    .where([
                    { name: (0, typeorm_1.ILike)(`%${query}%`) },
                    { description: (0, typeorm_1.ILike)(`%${query}%`) },
                ])
                    .andWhere("goods.currentPrice >= :min", { min: Math.max(0, min) })
                    .andWhere(new typeorm_1.Brackets(qb => {
                    qb.where("goods.currentPrice <= :max", { max: Math.max(0, max) })
                        .orWhere("0 = :max", { max: Math.max(0, max) });
                }))
                    .andWhere("pg.goods_id = goods.id")
                    .addSelect(subQuery => subQuery.select("MIN(product.count)", "left")
                    .from("product_goods", "pg")
                    .leftJoin("products", "product", "product.id = pg.product_id")
                    .where("pg.goods_id = goods.id"), "goods_left")
                    .getMany();
                return res.json(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    editItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, description, price, img, goodsType } = req.body;
                if (price <= 0) {
                    return res.status(400).json({ message: 'Нельзя установить цену меньше или равную 0' });
                }
                const itemFromDb = yield goods_repo_1.goodsRepo.findOneByOrFail({ id });
                itemFromDb.name = name;
                itemFromDb.description = description;
                itemFromDb.goodsType = goodsType;
                itemFromDb.img = img;
                itemFromDb.price = price;
                itemFromDb.currentPrice = Math.ceil(price * (100 - itemFromDb.discount) / 100);
                const result = yield goods_repo_1.goodsRepo.save(itemFromDb);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, description, img, goodsType, products } = req.body;
                if (price <= 0) {
                    return res.status(400).json({ message: 'Нельзя установить кол-во цену меньше или равную 0' });
                }
                const item = new goods_entity_1.Goods();
                item.name = name;
                item.price = price;
                item.currentPrice = price;
                item.discount = 0;
                item.goodsType = goodsType;
                item.img = img;
                item.description = description;
                const result = yield goods_repo_1.goodsRepo.save(item);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editDiscount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { discount, id } = req.body;
                if (discount < 0 || discount >= 100) {
                    return res.status(400).json({ message: 'Некорректный процент скидки' });
                }
                const itemFromDb = yield goods_repo_1.goodsRepo.findOneByOrFail({ id });
                itemFromDb.discount = discount;
                itemFromDb.currentPrice = Math.ceil(itemFromDb.price * (100 - itemFromDb.discount) / 100);
                ;
                const result = yield goods_repo_1.goodsRepo.save(itemFromDb);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new GoodsController;
