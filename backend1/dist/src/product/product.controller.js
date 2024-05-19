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
const product_entity_1 = require("./product.entity");
const product_repo_1 = require("./product.repo");
class ProductController {
    getAll(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const result = yield product_repo_1.productRepo.find({ order: { name: "asc" } });
                return res.json({ products: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, count } = req.body;
                const itemFromDb = yield product_repo_1.productRepo.findOneByOrFail({ id });
                if (count < 0) {
                    return res.status(400).json({ message: 'Нельзя установить кол-во продуктов меньше 0' });
                }
                itemFromDb.name = name;
                itemFromDb.count = count;
                const result = yield product_repo_1.productRepo.save(itemFromDb);
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
                const { name, count } = req.body;
                if (count < 0) {
                    return res.status(400).json({ message: 'Нельзя установить кол-во продуктов меньше 0' });
                }
                const product = new product_entity_1.Product();
                product.name = name;
                product.count = count;
                product.goods = [];
                const result = yield product_repo_1.productRepo.save(product);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ProductController;
